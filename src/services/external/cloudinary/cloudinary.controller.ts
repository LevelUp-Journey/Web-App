import { cloudinaryUploadImage } from "./cloudinary.actions";

export class CloudinaryController {
    public static async uploadImage(image: string): Promise<string> {
        try {
            const imageUrl = await cloudinaryUploadImage(image);
            console.log("cloudinary image response", imageUrl);
            return imageUrl;
        } catch {
            throw new Error("Error uploading image");
        }
    }
}
