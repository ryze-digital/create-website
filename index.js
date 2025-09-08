#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { BoilerplateInstaller } from './src/BoilerplateInstaller.js';
import { CliArgumentParser } from './src/CliArgumentParser.js';
import { InteractiveUserInputs } from './src/InteractiveUserInputs.js';

const parsedArgs = new CliArgumentParser().parseArgs();
const targetInstallDir = process.cwd();

const interactiveUserInputs = new InteractiveUserInputs(parsedArgs.defaultProjectName, parsedArgs.defaultOutputPath);
const installerResponses = await interactiveUserInputs.askAllInstallerQuestions();

if (fs.existsSync(path.join(targetInstallDir, 'package.json'))) {
    const shouldContinue = await interactiveUserInputs.askForConfirmation('A package.json file already exists. Continue?');

    if (!shouldContinue) {
        console.log(chalk.red('Aborting installation'));
        process.exit(0);
    }
}

await new BoilerplateInstaller().install(targetInstallDir, { ...installerResponses, logLevel: parsedArgs.logLevel });
console.info(chalk.green('Adventure ready'));
