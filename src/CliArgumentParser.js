class CliArgumentParser {
    /**
     * @typedef {object} ParsedArguments
     * @property {string|undefined} defaultProjectName
     * @property {string|undefined} defaultOutputPath
     * @property {string|undefined} logLevel
     */

    /**
     * @returns {ParsedArguments}
     */
    parseArgs() {
        const defaultProjectName = process.argv[2] || undefined;
        const defaultOutputPath = process.argv[3] || undefined;
        const logLevel = this.#parseLogLevelArgument();

        return {
            defaultProjectName,
            defaultOutputPath,
            logLevel,
        };
    }

    /**
     * @returns {string}
     */
    #parseLogLevelArgument() {
        const loglevelIndex = process.argv.indexOf('--loglevel');

        if (loglevelIndex > -1) {
            return process.argv[loglevelIndex + 1] || 'silent';
        }

        return 'silent';
    }
}

export {
    CliArgumentParser,
};
