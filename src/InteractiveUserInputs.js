import fs from 'node:fs';
import { BOILERPLATE_PATH } from './constants.js';
import { confirm, input, select } from '@inquirer/prompts';

class InteractiveUserInputs {
    /**
     * @typedef {object} InstallerUserResponses
     * @property {string} projectName
     * @property {string} boilerplate
     * @property {string} outputPath
     */

    /**
     * @param {string} defaultProjectName
     * @param {string} defaultOutputPath
     */
    constructor(defaultProjectName = '@namespace/project-name', defaultOutputPath = 'build') {
        this.defaultProjectName = defaultProjectName;
        this.defaultOutputPath = defaultOutputPath;
    }

    /**
     * @returns {Promise<InstallerUserResponses>}
     */
    async askAllInstallerQuestions() {
        const projectName = await this.#askProjectName();
        const boilerplate = await this.#askBoilerplate();
        const outputPath = await this.#askOutputPath();

        return {
            projectName,
            boilerplate,
            outputPath,
        };
    }

    /**
     * @param {string} message
     * @param {boolean} defaultValue
     * @returns {Promise<boolean>}
     */
    askForConfirmation(message, defaultValue = false) {
        return confirm({ message, default: defaultValue });
    }

    /**
     * @returns {Promise<string>}
     */
    #askProjectName() {
        return input({ message: 'What should the project name be?', default: this.defaultProjectName });
    }

    /**
     * @returns {Promise<string>}
     */
    #askOutputPath() {
        return input({ message: 'What should the output path be?', default: this.defaultOutputPath });
    }

    /**
     * @returns {Promise<string>}
     */
    #askBoilerplate() {
        const boilerplateNames = this.#getBoilerplateNames();

        return select({
            message: 'What boilerplate do you want to use?',
            choices: boilerplateNames.map((name) => {
                return {
                    name: this.#formatBoilerplateName(name),
                    value: name,

                };
            }),
            default: 'ecoma',
        });
    }

    /**
     * @returns {string[]}
     */
    #getBoilerplateNames() {
        return fs.readdirSync(BOILERPLATE_PATH)
            .sort(new Intl.Collator('en', { numeric: true, sensitivity: 'base' }).compare);
    }

    /**
     * @param {string} name
     * @returns {string}
     */
    #formatBoilerplateName(name) {
        return name
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => {
                return char.toUpperCase();
            });
    }
}

export {
    InteractiveUserInputs,
};
