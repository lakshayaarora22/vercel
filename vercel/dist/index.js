"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const simple_git_1 = __importDefault(require("simple-git"));
const utils_1 = require("./utils");
const file_1 = require("./file");
const path_1 = __importDefault(require("path"));
const aws_1 = require("./aws");
const redis_1 = require("redis");
// 5530fb932f8fd700966cae8046700fa9  (account id)
// yhpMNIRb8ri_yHG1hgH49Qe83jQIC8Cihr4BdIFr (token value)
// 862be6d6cd9018c5250b9f1fba93f4b8 (access keyid)
// e85e1e60483422efa200a3096b8909d1c96762f76e3270d8691fd5ddd924aa96 (secret access keyid)
// https://5530fb932f8fd700966cae8046700fa9.r2.cloudflarestorage.com
const publisher = (0, redis_1.createClient)();
publisher.connect();
const subscriber = (0, redis_1.createClient)();
subscriber.connect();
const app = (0, express_1.default)(); // creating a server using NodeJS (backend)
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repoUrl = req.body.repoUrl;
    console.log(repoUrl);
    const id = (0, utils_1.generate)(); // generate id
    console.log("Printing ID", id);
    yield (0, simple_git_1.default)().clone(repoUrl, path_1.default.join(__dirname, `output/${id}`)); // clone the github and store it in output/ folder
    // put the random id to AWS s3
    // We need array of files to be uploaded ["/dfff", "/frgv", "/rfftgtg", "/dfvggbffg"]
    const files = (0, file_1.getAllFiles)(path_1.default.join(__dirname, `output/${id}`));
    files.forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, aws_1.uploadFile)(file.slice(__dirname.length + 1), file);
    }));
    yield new Promise((resolve) => setTimeout(resolve, 5000));
    // @ts-ignore
    publisher.lPush("build-queue", id);
    // @ts-ignore
    publisher.hSet("status", id, "uploaded"); // similar to database
    // output/12345 -> required folder
    console.log(files);
    res.json({
        id: id
    });
}));
app.get("/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    const response = yield subscriber.hGet("status", id);
    res.json({
        status: response
    });
}));
app.listen(3000);
