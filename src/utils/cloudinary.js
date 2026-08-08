import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath) // remove the local saved file as upload operation has failed
        }
        return null;
    }
}

/**
 * Delete a resource from Cloudinary by its URL
 * @param {string} cloudinaryUrl - The full Cloudinary URL of the resource
 * @param {string} resourceType - "image" | "video" | "raw" (default: "image")
 * @returns {object|null} - Cloudinary response or null on failure
 */
const deleteFromCloudinary = async (cloudinaryUrl, resourceType = "image") => {
    try {
        if (!cloudinaryUrl) return null;

        // Extract public_id from URL
        // URL format: https://res.cloudinary.com/{cloud}/image/upload/v123/{public_id}.ext
        const urlParts = cloudinaryUrl.split("/");
        const fileWithExtension = urlParts[urlParts.length - 1];
        const publicId = fileWithExtension.split(".")[0];

        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });

        return response;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        return null;
    }
}

export { uploadOnCloudinary, deleteFromCloudinary }