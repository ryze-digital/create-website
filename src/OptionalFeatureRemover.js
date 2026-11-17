import fs from "node:fs";
import path from "node:path";
import { OPTIONAL_FEATURES } from "./constants.js";

export class OptionalFeatureRemover {
    static #FEATURE_MARKER_PATTERN = /feature:([\w-]+):(start|end)/;

    /**
     * @param {string} boilerplatePath
     * @param {string} installDirPath
     */
    constructor(boilerplatePath, installDirPath) {
        this.boilerplatePath = boilerplatePath;
        this.installDirPath = installDirPath;
    }

    /**
     * Strips the feature markers from all files which were copied from the boilerplate. Code blocks, files and
     * packages of disabled features are removed completely.
     * @param {string[]} disabledFeatureNames
     * @returns {void}
     */
    execute(disabledFeatureNames) {
        for (const relativeFilePath of this.#getBoilerplateFilePaths()) {
            this.#processFeatureBlocksInFile(path.join(this.installDirPath, relativeFilePath), disabledFeatureNames);
        }

        for (const featureName of disabledFeatureNames) {
            this.#deleteFiles(OPTIONAL_FEATURES[featureName].files);
        }

        this.#removePackages(
            disabledFeatureNames.flatMap((featureName) => {
                return OPTIONAL_FEATURES[featureName].packages;
            }),
        );
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
     * @param {string[]} disabledFeatureNames
     * @returns {void}
     */
    #processFeatureBlocksInFile(filePath, disabledFeatureNames) {
        const content = fs.readFileSync(filePath, "utf-8");

        if (!OptionalFeatureRemover.#FEATURE_MARKER_PATTERN.test(content)) {
            return;
        }

        fs.writeFileSync(filePath, this.#processFeatureBlocks(content, disabledFeatureNames));
    }

    /**
     * Removes all marker lines. Lines between the markers of a disabled feature are removed as well.
     * @param {string} content
     * @param {string[]} disabledFeatureNames
     * @returns {string}
     */
    #processFeatureBlocks(content, disabledFeatureNames) {
        const remainingLines = [];
        let insideDisabledBlock = false;

        for (const line of content.split("\n")) {
            const marker = line.match(OptionalFeatureRemover.#FEATURE_MARKER_PATTERN);

            if (marker !== null) {
                const [, featureName, position] = marker;

                if (disabledFeatureNames.includes(featureName)) {
                    insideDisabledBlock = position === "start";
                }

                continue;
            }

            if (!insideDisabledBlock) {
                remainingLines.push(line);
            }
        }

        return remainingLines.join("\n");
    }

    /**
     * @param {string[]} relativeFilePaths
     * @returns {void}
     */
    #deleteFiles(relativeFilePaths) {
        for (const relativeFilePath of relativeFilePaths) {
            fs.rmSync(path.join(this.installDirPath, relativeFilePath), { force: true });
        }
    }

    /**
     * @param {string[]} packageNames
     * @returns {void}
     */
    #removePackages(packageNames) {
        if (packageNames.length === 0) {
            return;
        }

        const packageJsonPath = path.join(this.installDirPath, "package.json");
        const json = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

        for (const packageName of packageNames) {
            delete json.dependencies?.[packageName];
            delete json.devDependencies?.[packageName];
        }

        fs.writeFileSync(packageJsonPath, `${JSON.stringify(json, null, 2)}\n`);
    }
}
