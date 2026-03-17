import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadVideo(filePath) {
    const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video',
        folder: 'hookfit',
    });
    return result.secure_url;
}

export async function downloadFile(url, destPath) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(buffer));
}

export async function deleteFromCloudinary(publicId) {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
}
```

Y en Railway añades estas tres variables de entorno con sus valores reales:
```
CLOUDINARY_CLOUD_NAME = dwxnirmx9
CLOUDINARY_API_KEY = 586745129119626
CLOUDINARY_API_SECRET = bzXXXTr1Lw3rjsfVAC3lmHwTca0