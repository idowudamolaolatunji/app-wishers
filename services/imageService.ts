import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";
import { ResponseType } from "@/utils/types";

const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadFileToCloudinary = async function(file: { uri: string } | string, folderName: string): Promise<ResponseType> {
    try {
        if(!file) return { success: true, data: null }
        if(typeof file == "string") {
            return { success: true, data: file };
        }

        if(file && file?.uri) {
            const formData = new FormData();
            formData.append("file", {
                uri: file?.uri,
                type: "image/jpeg",
                name: file?.uri?.split("/").pop() || "file.jpg",
            } as any);

            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            formData.append("folder", folderName);
        
            const res = await fetch(CLOUDINARY_API_URL, {
                method: "POST",
                headers: { "Content-Type": "multipart/form-data" },
                body: formData,
            });

            if(!res.ok) throw new Error("Error uploading image");

            const data = await res.json();
            // console.log("result", data);
            return { success: true, data: data?.secure_url }
        }
        
        return { success: true }
    } catch(err: any) {
        console.log("Error uploading file", err);
        return { success: false, msg: err?.message }
    }
}

export const getProfileImage = function(file: any) {
    if(file && typeof file === "string") return file;
    if(file && typeof file === "object") return file?.uri

    // return "https://res.cloudinary.com/dy3bwvkeb/image/upload/v1737549092/pngegg_yirbea.png";
    return require("@/assets/images/defaultAvatar.png");
}

export const getFilePath = function(file: any) {
    if(file && typeof file === "string") return file;
    if(file && typeof file === "object") return file?.uri

    return null;
}