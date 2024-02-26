import { exec, spawn } from "child_process";
import path from "path";

export function buildProject(id: string) {
    console.log("Reaching here --------------- 100", id);
    return new Promise((resolve) => {
        console.log("Reaching here -------- 1", path.join(__dirname, `output/${id}`));
        const child = exec(`cd ${path.join(__dirname, `output/${id}`)} && npm install && npm run build`);
        console.log("Reaching here -------- 2");
        child.stdout?.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        child.stderr?.on('data', function(data) {
            console.log('stderr: ' + data);
        });
        console.log("Reaching here -------- 3");
        child.on('close', function(code) {
           resolve("");
        });

    })

}