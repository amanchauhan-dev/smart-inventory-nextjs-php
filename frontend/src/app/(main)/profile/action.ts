'use server'

import { UploadProfile } from "@/lib/cloudinary";


export const uploadeProfileImage = async (file: File, url?: string): Promise<{ url?: string, error?: any }> => {
    try {
        const uploade = await UploadProfile(file, url);
        if (uploade.error || !uploade.newUrl) {
            throw new Error(uploade?.error?.message ?? "Upload Error")
        }
        return {
            url: uploade.newUrl
        }
    } catch (error) {
        return {
            error
        }
    }
}