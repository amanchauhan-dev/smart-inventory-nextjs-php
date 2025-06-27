import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});


export const UploadProfile = async (file: File, oldUrl?: string | null) => {
    try {
        if (oldUrl) {
            const publicId = extractPublicId(oldUrl);
            console.log('publicID', publicId);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }
        const buffer = await file.arrayBuffer();
        const bytes = Buffer.from(buffer);
        const uploadRes = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({
                    folder: "smart-inventory/profiles",
                    transformation: [
                        { width: 500, height: 500, crop: "thumb", gravity: "face" }
                    ]
                }, (error, result) => {
                    if (error) { return reject(error); }
                    resolve(result);
                })
                .end(bytes);
        });
        return { newUrl: uploadRes.secure_url }
    } catch (error) {
        return {
            error: {
                message: "Upload failed", details: error
            }
        }
    }
}

function extractPublicId(url: string): string | null {
    try {
        const parts = url.split("/");
        const lastPart = parts.pop()?.split(".")[0]; // remove .jpg, .png, etc.
        const folder = parts.slice(parts.indexOf("upload") + 2).join("/"); // after "upload"
        return `${folder}/${lastPart}`;
    } catch {
        return null;
    }
}



export const UploadFileGeneric = async (file: File, oldUrl?: string | null) => {
    try {
        if (oldUrl) {
            const publicId = extractPublicId(oldUrl);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        const buffer = await file.arrayBuffer();
        const bytes = Buffer.from(buffer);

        const uploadRes = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: "smart-inventory/uploads",
                        resource_type: "auto",
                    },
                    (error, result) => {
                        if (error) { return reject(error) }
                        resolve(result);
                    }
                )
                .end(bytes);
        });

        return { newUrl: uploadRes.secure_url };
    } catch (error) {
        return {
            error: {
                message: "Upload failed",
                details: error,
            },
        };
    }
};