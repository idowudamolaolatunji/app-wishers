import { firestore } from "@/config/firebase";
import { ResponseType } from "@/utils/types";
import { collection, getDocs, query, where, writeBatch } from "firebase/firestore";


export const markAllNotificationAsRead = async function(uid: string): Promise<ResponseType> {
    try {
        const notifCol = collection(firestore, "notifications");
        const q = query(notifCol, where("uid", "==", uid), where("read", "==", false));

        const snapshot = await getDocs(q);

        if (snapshot.empty) return { success: false };
        
        const batch = writeBatch(firestore);

        snapshot.forEach((docSnap) => {
            batch.update(docSnap.ref, {
                read: true,
                readAt: new Date().toISOString(),
            });
        });

        await batch.commit();

        return { success: true, msg: "Notications Read!" }
    } catch(err: any) {
        return { success: false, msg: err?.message }
    }
}


export const getUnreadNotificationCount = async function(uid: string): Promise<ResponseType> {
    try {
        const notifCol = collection(firestore, "notifications");
        const q = query(notifCol, where("uid", "==", uid), where("read", "==", false));

        const snapshot = await getDocs(q);
        return { success: true, msg: "Notications Read!", data: snapshot?.size }
    } catch(err: any) {
        return { success: false, msg: err?.message }
    }
}