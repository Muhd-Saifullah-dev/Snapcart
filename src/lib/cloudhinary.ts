import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

const uploadOnCloudhinary = async (file: Blob): Promise<string | null> => {
  try {
    if (!file) {
      return null;
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return new Promise((resolve, reject) => {
      const uploadstrem = cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'my_grocery' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result?.secure_url ?? null);
          }
        }
      );
      uploadstrem.end(buffer);
    });
  } catch (error) {
    console.log('error in cloudhinary', error);
    return null;
  }
};


export default uploadOnCloudhinary