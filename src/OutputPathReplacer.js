import fs from "node:fs";
import path from "node:path";
import { OUTPUT_PATH_PLACEHOLDER } from "./constants.js";

export class OutputPathReplacer {
    /**
     * @param {string} boilerplatePath
     * @param {string} installDirPath
     * @param {string} outputPath
     */
    constructor(boilerplatePath, installDirPath, outputPath) {
        this.boilerplatePath = boilerplatePath;
        this.installDirPath = installDirPath;
        this.outputPath = outputPath;
    }

    /**
     * Replaces the output path placeholder in all files which were copied from the boilerplate
     * @returns {void}
     */
    execute() {
        for (const relativeFilePath of this.#getBoilerplateFilePaths()) {
            this.#replaceInFile(path.join(this.installDirPath, relativeFilePath));
        }
    }

    /**
     * @returns {string[]}
     */
    #getBoilerplateFilePaths() {
        return fs.readdirSync(this.boilerplatePath, { recursive: true }).filter((relativeFilePath) => {
            return fs.statSync(path.join(this.boilerplatePath, relativeFilePath)).isFile();
        });
    }

    /**
     * @param {string} filePath
     * @returns {void}
     */
    #replaceInFile(filePath) {
        const content = fs.readFileSync(filePath);

        if (!content.includes(OUTPUT_PATH_PLACEHOLDER)) {
            return;
        }

        fs.writeFileSync(filePath, content.toString("utf-8").replaceAll(OUTPUT_PATH_PLACEHOLDER, this.outputPath));
    }
}
