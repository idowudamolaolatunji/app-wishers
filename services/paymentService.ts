import { firestore } from "@/config/firebase";
import { AppTransactionType, ResponseType } from "@/utils/types";
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

export const processWishlistBoosting = async function(reference: string, uid: string, amount: number, wishlistId: string, durationInMS: number): Promise<ResponseType> {
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
            uid, refId: reference,
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
            previousBoostingCount: increment(1),
        });
        console.log("It works")
        return { success: true }
    } catch(err: any) {
        return { success: false, msg: err?.message };
    }
}