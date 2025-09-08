#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'node:fs';
import fse from 'fs-extra';
import path from 'node:path';
import { InteractiveUserInputs } from './src/InteractiveUserInputs.js';
import { PackageJsonUpdater } from './src/PackageJsonUpdater.js';

const currentDirectory = path.dirname(fse.realpathSync(process.argv[1]));
const defaultProjectName = process.argv[2];
const defaultOutputPath = process.argv[3];
const loglevelIndex = process.argv.indexOf('--loglevel');
let loglevel;

if (loglevelIndex > -1) {
    loglevel = process.argv[loglevelIndex + 1];
}

loglevel = (loglevel || 'silent');

const interactiveUserInputs = new InteractiveUserInputs(defaultProjectName, defaultOutputPath);
const installerResponses = await interactiveUserInputs.askAllInstallerQuestions();

if (fs.existsSync('package.json')) {
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
fse.copySync(path.join(currentDirectory, 'boilerplates', installerResponses.boilerplate), process.cwd());

console.log(chalk.yellow('Installing packages'));
new PackageJsonUpdater(installerResponses.projectName, loglevel, installerResponses.outputPath);