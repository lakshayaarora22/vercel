import express from "express";
import { S3 } from "aws-sdk";

const s3 = new S3({
    accessKeyId: "862be6d6cd9018c5250b9f1fba93f4b8",
    secretAccessKey: "e85e1e60483422efa200a3096b8909d1c96762f76e3270d8691fd5ddd924aa96",
    endpoint: "https://5530fb932f8fd700966cae8046700fa9.r2.cloudflarestorage.com"
});

const app = express();

app.get("/*", async (req, res) => {
    const host = req.hostname;

    const id = host.split(".")[0];
    const filePath = req.path;

    const contents = await s3.getObject({
        Bucket: "vercel",
        Key: `dist/${id}${filePath}`
    }).promise();
    
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);

    res.send(contents.Body);
})

app.listen(3001);