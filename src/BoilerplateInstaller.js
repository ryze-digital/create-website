import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { BOILERPLATE_PATH } from './constants.js';
import { PackageJsonUpdater } from './PackageJsonUpdater.js';

class BoilerplateInstaller {
    /**
     * @param {string} installDirPath
     * @param {object} installOptions
     * @param {string} installOptions.projectName
     * @param {string} installOptions.outputPath
     * @param {string} installOptions.boilerplate
     * @param {string} installOptions.logLevel
     * @returns {void}
     */
    install(installDirPath, installOptions) {
        this.#preInstallStep(installDirPath);

        console.log(chalk.yellow('Copying files from boilerplate'));
        this.#copyBoilerplateFiles(installDirPath, installOptions.boilerplate);

        console.log(chalk.yellow('Installing packages'));
        new PackageJsonUpdater(installOptions.projectName, installOptions.logLevel, installOptions.outputPath);
    }

    /**
     * @param {string} installDirPath
     * @returns {void}
     */
    #preInstallStep(installDirPath) {
        const gitKeepFilePath = path.join(installDirPath, '.gitkeep');

        if (fs.existsSync(gitKeepFilePath)) {
            console.log(chalk.yellow('Deleting exisiting .gitkeep file'));
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

export {
    BoilerplateInstaller,
};
