import fs from "fs";

if (fs.existsSync("__OUTPUT_PATH__")) {
    fs.rm("__OUTPUT_PATH__", { recursive: true }, (err) => {
        if (err) {
            console.error(err.message);

            return;
        }
        console.info("Folder deleted successfully");
    });
}
