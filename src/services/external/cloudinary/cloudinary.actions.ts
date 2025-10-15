"use server";

import cloudinary from "./cloudinary.config";

export async function cloudinaryUploadImage(image: string): Promise<string> {
    try {
        const result = await cloudinary.uploader.upload(image);
        s;
        return result.secure_url;
    } catch (error) {
        throw new Error("Failed to upload image");
    }
}
