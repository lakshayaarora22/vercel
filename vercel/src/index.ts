import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import { getAllFiles } from "./file";
import path from "path";
import { uploadFile } from "./aws";
import { createClient } from "redis";

// 5530fb932f8fd700966cae8046700fa9  (account id)
// yhpMNIRb8ri_yHG1hgH49Qe83jQIC8Cihr4BdIFr (token value)
// 862be6d6cd9018c5250b9f1fba93f4b8 (access keyid)
// e85e1e60483422efa200a3096b8909d1c96762f76e3270d8691fd5ddd924aa96 (secret access keyid)
// https://5530fb932f8fd700966cae8046700fa9.r2.cloudflarestorage.com

const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

const app = express(); // creating a server using NodeJS (backend)
app.use(cors());
app.use(express.json());

app.post("/deploy", async(req, res) => {
    const repoUrl = req.body.repoUrl;
    console.log(repoUrl);
    const id = generate(); // generate id
    console.log("Printing ID", id);
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`)); // clone the github and store it in output/ folder
    // put the random id to AWS s3
    // We need array of files to be uploaded ["/dfff", "/frgv", "/rfftgtg", "/dfvggbffg"]
    const files = getAllFiles(path.join(__dirname, `output/${id}`));
    files.forEach(async file => {
        await uploadFile(file.slice(__dirname.length + 1), file);
    })
    await new Promise((resolve) => setTimeout(resolve, 5000));
    // @ts-ignore
    publisher.lPush("build-queue", id);
    // @ts-ignore
    publisher.hSet("status", id, "uploaded"); // similar to database
    // output/12345 -> required folder
    console.log(files);
    res.json({
        id: id
    })
});

app.get("/status", async(req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);
    res.json({
        status: response
    })
});

app.listen(3000);