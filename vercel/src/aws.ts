import { S3 } from "aws-sdk";
import fs from "fs";

// replace with your own credentials
const s3 = new S3({
    accessKeyId: "862be6d6cd9018c5250b9f1fba93f4b8",
    secretAccessKey: "e85e1e60483422efa200a3096b8909d1c96762f76e3270d8691fd5ddd924aa96",
    endpoint: "https://5530fb932f8fd700966cae8046700fa9.r2.cloudflarestorage.com"
})

// fileName => output/12312/src/App.jsx
// filePath => /Users/harkiratsingh/vercel/dist/output/12312/src/App.jsx

export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName,
    }).promise();
    console.log(response);
}