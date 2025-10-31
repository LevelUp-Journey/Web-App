import { generateCloudinarySignature } from "./cloudinary.actions";

const CLOUDINARY_CLOUD_NAME =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dkkfv72vo";
const CLOUDINARY_API_KEY =
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "933614744521526";

export class CloudinaryController {
    /**
     * Uploads an image to Cloudinary using signed upload.
     * This method should be called from client components.
     *
     * @param file - The file to upload
     * @param folder - Optional folder name in Cloudinary
     * @returns The secure URL of the uploaded image
     */
    public static async uploadImage(
        file: File,
        folder: string = "uploads",
    ): Promise<string> {
        try {
            // Get signature from server
            const { signature, timestamp } = await generateCloudinarySignature({
                folder,
            });

            // Upload directly to Cloudinary with signature
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", folder);
            formData.append("timestamp", timestamp.toString());
            formData.append("signature", signature);
            formData.append("api_key", CLOUDINARY_API_KEY);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Upload failed");
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("CloudinaryController error:", error);
            throw error;
        }
    }
}
