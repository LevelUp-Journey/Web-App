import { v2 as cloudinary } from "cloudinary";
import { ENV } from "@/lib/env";

const config = {
  cloud_name: ENV.SERVICES.EXTERNAL.CLOUDINARY.CLOUD_NAME,
  api_key: ENV.SERVICES.EXTERNAL.CLOUDINARY.API_KEY,
  api_secret: ENV.SERVICES.EXTERNAL.CLOUDINARY.API_SECRET,
};

if (
  config.api_secret === undefined ||
  config.api_key === undefined ||
  config.cloud_name === undefined
) {
  throw new Error("Cloudinary env variables are not defined");
}

cloudinary.config(config);

export default cloudinary;
