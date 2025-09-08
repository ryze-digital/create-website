#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'node:fs';
import fse from 'fs-extra';
import path from 'node:path';
import { BOILERPLATE_PATH } from './src/constants.js';
import { CliArgumentParser } from './src/CliArgumentParser.js';
import { InteractiveUserInputs } from './src/InteractiveUserInputs.js';
import { PackageJsonUpdater } from './src/PackageJsonUpdater.js';

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

if (installerResponses.boilerplate === 'ecoma') {
    console.log(chalk.yellow('Delete exisiting .gitkeep file'));
    fse.unlink(path.resolve('.gitkeep'), () => {});
}

console.log(chalk.yellow('Copy files from boilerplate'));
fse.copySync(path.join(BOILERPLATE_PATH, installerResponses.boilerplate), targetInstallDir);

console.log(chalk.yellow('Installing packages'));
new PackageJsonUpdater(installerResponses.projectName, parsedArgs.logLevel, installerResponses.outputPath);
