const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = (fileBuffer, folder = 'uploads') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const handleImageUploads = async (files, existingData, folder = 'uploads') => {
  const updatedData = { ...existingData };
  const fields = ['featuredImage', 'ogImage', 'twitterImage'];

  for (const field of fields) {
    if (files && files[field] && files[field][0]) {
      const result = await uploadToCloudinary(files[field][0].buffer, folder);
      updatedData[field] = result.secure_url;
    }
  }

  return updatedData;
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  handleImageUploads
};

