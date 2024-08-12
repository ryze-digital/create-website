#!/usr/bin/env node

import { PackageJsonUpdater } from './src/PackageJsonUpdater.js';
import chalk from 'chalk';
import path from 'node:path';
import fse from 'fs-extra';

const currentDirectory = path.dirname(fse.realpathSync(process.argv[1]));
const projectName = process.argv[2];
let outputPath = process.argv[3];
const loglevelIndex = process.argv.indexOf('--loglevel');
let loglevel;

if (loglevelIndex > -1) {
    loglevel = process.argv[loglevelIndex + 1];
}

loglevel = (loglevel || 'silent');

if (typeof projectName === 'undefined' || projectName === '@namespace/project-name') {
    console.error(chalk.red('Please enter the name of your project'));
    process.exit(9);
}

if (typeof outputPath === 'undefined') {
    outputPath = 'build';
}

console.log(chalk.yellow('Delete exisiting .gitkeep file'));
fse.unlink(path.resolve('.gitkeep'), () => {});

console.log(chalk.yellow('Copy files from boilerplate'));
fse.copySync(path.join(currentDirectory, 'boilerplate'), process.cwd());

console.log(chalk.yellow('Installing packages'));
new PackageJsonUpdater(projectName, loglevel, outputPath);