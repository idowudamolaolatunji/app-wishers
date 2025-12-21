import { firestore } from "@/config/firebase";
import { generateSlug } from "@/utils/helpers";
import { AppTransactionType, BankAccountType, ResponseType, UserType, WithdrawalChargesType } from "@/utils/types";
import { collection, doc, increment, setDoc, updateDoc } from "firebase/firestore";

export const processOneTimePayment = async function(reference: string, uid: string, amount: number): Promise<ResponseType> {
    try {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${process.env.EXPO_PUBLIC_PAYSTACK_SECRET_KEY}` }
        });

        const data = await response.json();
        if (!data?.status) return { success: false, msg: "Unable to Verify Payment" };

        const result = data.data;
        const charges = (Number(result?.amount) / 100) - amount!;
        const dataToSave = {
            email: result?.customer?.email,
            amount: amount,
            charges: charges,
            paidAmount: Number(result?.amount) / 100,
            status: result?.status,
            type: "one-time",
            currency: result?.currency,
            uid, refId: reference,
            paidAt: result.paidAt,
        } as AppTransactionType

        const appPaymentRef = doc(collection(firestore, "app_transactions"));
        await setDoc(appPaymentRef, dataToSave, { merge: true });
        return { success: true }
    } catch(err: any) {
        return { success: false, msg: err?.message };
    }
}


export const processWishlistBoosting = async function(reference: string, creator: Partial<UserType>, amount: number, wishlistId: string, durationInMS: number, planName: string): Promise<ResponseType> {
    try {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${process.env.EXPO_PUBLIC_PAYSTACK_SECRET_KEY}` }
        });

        const data = await response.json();
        if (!data?.status) return { success: false, msg: "Unable to Verify Payment" };

        const result = data.data;
        const charges = (Number(result?.amount) / 100) - amount!;
        const dataToSave = {
            email: result?.customer?.email,
            amount: amount,
            charges: charges,
            paidAmount: Number(result?.amount) / 100,
            type: "boosting",
            status: result?.status,
            currency: result?.currency,
            uid: creator?.uid, refId: reference,
            paidAt: result.paidAt,
        } as AppTransactionType

        const appPaymentRef = doc(collection(firestore, "app_transactions"));
        await setDoc(appPaymentRef, dataToSave, { merge: true });

        // here for the wishlist
        if (!wishlistId) {
            return { success: false, msg: "Wishlist ID is required" };
        }
        const wishlistRef = doc(firestore, "wishlists", wishlistId);
        await updateDoc(wishlistRef, {
            currentboostExpiresAt: new Date(Date.now() + durationInMS!).toISOString(),
            lastBoostedAt: new Date().toISOString(),
            lastBoostingPlanName: planName,
            previousBoostingCount: increment(1),
            boostingCreator: {
                name: creator?.name,
                image: creator?.image || ""
            }
        });

        return { success: true }
    } catch(err: any) {
        return { success: false, msg: err?.message };
    }
}


export const processWithdrawalTransaction = async function(uid: string, amount: number, bankAccount: BankAccountType, charges: WithdrawalChargesType, reason?: string ): Promise<ResponseType> {
    const recipientData = {
        type: 'nuban',
        name: bankAccount?.accountName,
        account_number: bankAccount?.accountNumber,
        bank_code: bankAccount?.bankCode,
        currency: bankAccount?.currency || "NGN",
    };

    // THREE STEPS TO MAKING A TRANSFER (WITHDRAWAL)
    // 1. CREATE A RECEPIENT CODE
    // 2. INITIALIZE PAYMENT

    try {
        const recepient_res = await fetch(`https://api.paystack.co/transferrecipient`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.EXPO_PUBLIC_WISHLIST_PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(recipientData),
        });

        const recepient_data = await recepient_res.json();
        const recipientCode = recepient_data?.data?.recipient_code;
        // console.log(recipientCode);


        const init_res = await fetch(`https://api.paystack.co/transfer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.EXPO_PUBLIC_WISHLIST_PAYSTACK_SECRET_KEY}`,
            },
            body: JSON.stringify({
                source: "balance",
                amount: amount * 100, // amount in kobo
                recipient: recipientCode,
                reference: generateSlug(16),
                reason,
            })
        });

        const init_data = await init_res.json();
        const reference = init_data?.data?.refeence;
        console.log(init_data, reference);

        if(!init_data?.status && init_data?.code == "insufficient_balance") {
            return { success: false, msg: "Something went wrong with the withdrawal, Contact the admin",  }
        }

        const status_res = await fetch(`https://api.paystack.co/transfer/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.EXPO_PUBLIC_WISHLIST_PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        const status_data = await status_res.json();
        console.log(status_data)

        const app_transaction = {
            email: status_data?.customer?.email,
            amount: amount,
            charges: charges?.paystack,
            paidAmount: charges?.profit,
            status: "status",
            type: "app-percent",
            currency: status_data?.currency,
            uid, refId: reference,
            paidAt: status_data.paidAt,
        } as AppTransactionType;

        const appPaymentRef = doc(collection(firestore, "app_transactions"));
        await setDoc(appPaymentRef, app_transaction, { merge: true });


        return { success: true }
    } catch(err: any) {
        return { success: false, msg: err?.message };
    }
}