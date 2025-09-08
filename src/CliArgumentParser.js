import { chalkStderr } from 'chalk';
import { parseArgs } from 'node:util';

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
        let parsedArgs;

        try {
            parsedArgs = parseArgs({
                allowPositionals: true,
                options: {
                    loglevel: {
                        type: 'string',
                    },
                },
            });
        } catch (err) {
            if (typeof err.code === 'string' && err.code.startsWith('ERR_PARSE_ARGS_')) {
                console.error(chalkStderr.red(err.message));
                process.exit(1);
            }
            throw err;
        }

        return {
            defaultProjectName: parsedArgs.positionals[0],
            defaultOutputPath: parsedArgs.positionals[1],
            logLevel: parsedArgs.values.loglevel,
        };
    }
}

export {
    CliArgumentParser,
};
