import { firestore } from "@/config/firebase";
import { ResponseType } from "@/utils/types";
import { collection, doc, setDoc } from "firebase/firestore";


export const createWallet = async function (uid: string): Promise<ResponseType> {
    try {
        const dataToSave = {
            uid,
            allTimeBalance: 0,
            remainingBalance: 0,
            referralEarnings: 0,
            contributedEarning: 0,
            created: new Date(),
        }

        const walletRef = doc(collection(firestore, "wallets"));
        await setDoc(walletRef, dataToSave, { merge: true });

        return { success: true };
    } catch (err: any) {
        console.log("Error creating or update wishlist");
        return { success: false, msg: err?.message };
    }
};