"use server";

import cloudinary from "./cloudinary.config";

/**
 * Generates a signature for client-side signed uploads to Cloudinary.
 * This allows secure uploads without exposing the API secret.
 */
export async function generateCloudinarySignature(
    paramsToSign: Record<string, string | number>,
): Promise<{ signature: string; timestamp: number }> {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
        {
            ...paramsToSign,
            timestamp,
        },
        cloudinary.config().api_secret as string,
    );

    return { signature, timestamp };
}
