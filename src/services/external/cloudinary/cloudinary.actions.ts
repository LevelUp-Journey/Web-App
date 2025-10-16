"use server";

import cloudinary from "./cloudinary.config";

export async function cloudinaryUploadImage(image: string): Promise<string> {
    try {
        const result = await cloudinary.uploader.upload(image);
        return result.secure_url;
    } catch {
        throw new Error("Failed to upload image");
    }
}
