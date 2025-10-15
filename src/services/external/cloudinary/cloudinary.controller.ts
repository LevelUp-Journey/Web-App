import { cloudinaryUploadImage } from "./cloudinary.actions";

export class CloudinaryController {
  public async uploadImage(image: string): Promise<string> {
    try {
      const imageUrl = await cloudinaryUploadImage(image);
      console.log("cloudinary image response", imageUrl);
      return imageUrl;
    } catch (error) {
      throw new Error("Error uploading image");
    }
  }
}
