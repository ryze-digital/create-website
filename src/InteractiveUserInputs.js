import { confirm, input, select } from "@inquirer/prompts";
import fs from "node:fs";
import { BOILERPLATE_PATH } from "./constants.js";

export class InteractiveUserInputs {
    static #EXAMPLE_PROJECT_NAME = "@namespace/project-name";

    /**
     * @typedef {object} InstallerUserResponses
     * @property {string} projectName
     * @property {string} boilerplate
     * @property {string} outputPath
     * @property {boolean} useLazysizes
     * @property {boolean} useCkeditorStyles
     */

    /**
     * @param {string} defaultProjectName
     * @param {string} defaultOutputPath
     */
    constructor(defaultProjectName = InteractiveUserInputs.#EXAMPLE_PROJECT_NAME, defaultOutputPath = "build") {
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
        const useLazysizes = await this.#askUseLazysizes();
        const useCkeditorStyles = await this.#askUseCkeditorStyles();

        return {
            projectName,
            boilerplate,
            outputPath,
            useLazysizes,
            useCkeditorStyles,
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
        return input({
            message: "What should the project name be?",
            default: this.defaultProjectName,
            validate: (value) => {
                if (value === InteractiveUserInputs.#EXAMPLE_PROJECT_NAME) {
                    return "Please enter a proper project name";
                }

                return true;
            },
        });
    }

    /**
     * @returns {Promise<string>}
     */
    #askOutputPath() {
        return input({
            message: "What should the output path be?",
            default: this.defaultOutputPath,
            validate: (value) => {
                if (!/^[\w./-]+$/.test(value)) {
                    return 'The output path may only contain letters, numbers, ".", "_", "-" and "/"';
                }

                return true;
            },
        });
    }

    /**
     * @returns {Promise<boolean>}
     */
    #askUseLazysizes() {
        return this.askForConfirmation("Do you want to use lazysizes?", true);
    }

    /**
     * @returns {Promise<boolean>}
     */
    #askUseCkeditorStyles() {
        return this.askForConfirmation("Do you need a separate Sass entry for CKEditor?", true);
    }

    /**
     * @returns {Promise<string>}
     */
    #askBoilerplate() {
        const boilerplateNames = this.#getBoilerplateNames();

        return select({
            message: "What boilerplate do you want to use?",
            choices: boilerplateNames.map((name) => {
                return {
                    name: this.#formatBoilerplateName(name),
                    value: name,
                };
            }),
            default: "legacy",
        });
    }

    /**
     * @returns {string[]}
     */
    #getBoilerplateNames() {
        return fs
            .readdirSync(BOILERPLATE_PATH)
            .sort(new Intl.Collator("en", { numeric: true, sensitivity: "base" }).compare);
    }

    /**
     * @param {string} name
     * @returns {string}
     */
    #formatBoilerplateName(name) {
        return name
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => {
                return char.toUpperCase();
            });
    }
}
