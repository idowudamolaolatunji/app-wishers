import { firestore } from "@/config/firebase";
import { BankAccountType, ResponseType } from "@/utils/types";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";

export async function handleFetchBanks(currencyName: string): Promise<ResponseType> {
    try {
        const response = await fetch(`https://api.paystack.co/bank?currency=${currencyName}`);
        const data = await response.json();
        if (!data.status) throw new Error(data.message);
        return { success: true, data };
    } catch(err: any) {
        return { success: false, msg: err?.message };
    }
}


export async function handleResolveAccount(accountNumber: string, code: string, currencyName: string): Promise<ResponseType> {
    try {
        const response = await fetch(`https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${code}&currency=${currencyName}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.EXPO_PUBLIC_PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        // console.log(response)
        const data = await response.json();
        if (!data.status) throw new Error(data.message);
        return { success: true, data };
    } catch(err: any) {
        return { success: false, msg: err?.message };
    }
}


export const addBankDetails = async function (bankData: Partial<BankAccountType>): Promise<ResponseType> {
    try {
        let bankDataToSave = { ...bankData };
        const bankDataRef = doc(collection(firestore, "bankaccounts"));
        await setDoc(bankDataRef, bankDataToSave, { merge: true });

        return { success: true, data: bankDataToSave };
    } catch (err: any) {
        return { success: false, msg: err?.message };
    }
};

export const deleteBankDetails = async function (dataId: string): Promise<ResponseType> {
    try {
        const dataRef = doc(firestore, "bankaccounts", dataId);
        await deleteDoc(dataRef);

        // const bankCol = collection(firestore, "bankaccounts");

        // // Get the one document where uid == userId
        // const q = query(bankCol, where("uid", "==", uid));
        // const snap = await getDocs(q);

        // if (snap.empty) {
        //   return { success: false, msg: "No bank details found." };
        // }

        // // There is only one document, so delete it
        // const docSnap = snap.docs[0];
        // await deleteDoc(docSnap.ref);

        return { success: true }
    } catch(err: any) {
        console.log(err)
        return { success: false, msg: err?.message };
    }
}