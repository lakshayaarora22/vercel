"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProject = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
function buildProject(id) {
    console.log("Reaching here --------------- 100", id);
    return new Promise((resolve) => {
        var _a, _b;
        console.log("Reaching here -------- 1", path_1.default.join(__dirname, `output/${id}`));
        const child = (0, child_process_1.exec)(`cd ${path_1.default.join(__dirname, `output/${id}`)} && npm install && npm run build`);
        console.log("Reaching here -------- 2");
        (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on('data', function (data) {
            console.log('stdout: ' + data);
        });
        (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.on('data', function (data) {
            console.log('stderr: ' + data);
        });
        console.log("Reaching here -------- 3");
        child.on('close', function (code) {
            resolve("");
        });
    });
}
exports.buildProject = buildProject;