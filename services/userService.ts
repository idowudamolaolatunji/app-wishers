import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/utils/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const updateUser = async function(uid: string, updatedData: UserDataType): Promise<ResponseType> {
    try {
        // check for image before attemp upload
        if(updatedData.name && updatedData.image?.uri) {
            const imageUploadRes = await uploadFileToCloudinary(updatedData?.image, "users");
            if(!imageUploadRes.success) {
                return { success: false, msg: imageUploadRes.msg };
            }

            updatedData.image = imageUploadRes.data;
        }
        const userRef = doc(firestore, "users", uid)
        await updateDoc(userRef, updatedData)

        return { success: true, msg: "updated successfully!" }
    } catch(err: any) {
        console.log("Error updating user", err);
        return { success: false, msg: err?.message }
    }
}