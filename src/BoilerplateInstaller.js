import chalk from "chalk";
import fs from "node:fs";
import path from "node:path";
import { BOILERPLATE_PATH } from "./constants.js";
import { OptionalFeatureRemover } from "./OptionalFeatureRemover.js";
import { OutputPathReplacer } from "./OutputPathReplacer.js";
import { PackageJsonUpdater } from "./PackageJsonUpdater.js";

export class BoilerplateInstaller {
    /**
     * @param {string} installDirPath
     * @param {object} installOptions
     * @param {string} installOptions.projectName
     * @param {string} installOptions.outputPath
     * @param {string} installOptions.boilerplate
     * @param {boolean} installOptions.useLazysizes
     * @param {boolean} installOptions.useCkeditorStyles
     * @param {string} installOptions.logLevel
     * @returns {Promise<void>}
     */
    async install(installDirPath, installOptions) {
        this.#preInstallStep(installDirPath);

        console.log(chalk.yellow("Copying files from boilerplate"));
        this.#copyBoilerplateFiles(installDirPath, installOptions.boilerplate);

        console.log(chalk.yellow("Setting output path"));
        new OutputPathReplacer(
            path.join(BOILERPLATE_PATH, installOptions.boilerplate),
            installDirPath,
            installOptions.outputPath,
        ).execute();

        const disabledFeatures = this.#getDisabledFeatures(installOptions);

        if (disabledFeatures.length > 0) {
            console.log(chalk.yellow(`Removing optional features: ${disabledFeatures.join(", ")}`));
        }

        new OptionalFeatureRemover(path.join(BOILERPLATE_PATH, installOptions.boilerplate), installDirPath).execute(
            disabledFeatures,
        );

        console.log(chalk.yellow("Installing packages"));
        await new PackageJsonUpdater(
            installOptions.projectName,
            installOptions.logLevel,
            path.join(installDirPath, "package.json"),
        ).execute();
    }

    /**
     * @param {object} installOptions
     * @param {boolean} installOptions.useLazysizes
     * @param {boolean} installOptions.useCkeditorStyles
     * @returns {string[]} names of the optional features (see OPTIONAL_FEATURES) the user opted out of
     */
    #getDisabledFeatures(installOptions) {
        const featureUsage = {
            lazysizes: installOptions.useLazysizes,
            ckeditor: installOptions.useCkeditorStyles,
        };

        return Object.keys(featureUsage).filter((featureName) => {
            return !featureUsage[featureName];
        });
    }

    /**
     * @param {string} installDirPath
     * @returns {void}
     */
    #preInstallStep(installDirPath) {
        const gitKeepFilePath = path.join(installDirPath, ".gitkeep");

        if (fs.existsSync(gitKeepFilePath)) {
            console.log(chalk.yellow("Deleting exisiting .gitkeep file"));
            fs.unlinkSync(gitKeepFilePath);
        }
    }

    /**
     * @param {string} installDirPath
     * @param {string} boilerplateName
     * @returns {void}
     */
    #copyBoilerplateFiles(installDirPath, boilerplateName) {
        fs.cpSync(path.join(BOILERPLATE_PATH, boilerplateName), installDirPath, { recursive: true });
    }
}
