import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (buffer) => {
  try {
    const base64 = `data:image/png;base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "products",
    });

    return result;
  } catch (err) {
    console.error("UPLOAD ERROR");
    console.error(err);

    throw err;
  }
};
