#!/usr/bin/env node

import { PackageJsonUpdater } from './src/PackageJsonUpdater.js';
import chalk from 'chalk';
import path from 'node:path';
import fs from 'fs';
import fse from 'fs-extra';
import * as readline from 'readline'
import cliSelect from 'cli-select';

function askYesOrNo(query) {
    let ans = false;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, (answer) => {
        answer = answer.toLowerCase();

        if (answer === 'y' || answer === 'yes') {
            ans = true
        }

        rl.close();
        resolve(ans);
    }))
}
function askInput(query) {
    let answer = '';

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, (answer) => {
        answer = answer.toLowerCase();

        rl.close();
        resolve(answer);
    }))
}

const boilerplates = fs.readdirSync('boilerplates').filter(file =>
    fs.statSync(path.join('boilerplates', file)).isDirectory()
);
const boilerplate = await cliSelect({
    values: boilerplates,
    valueRenderer: (value, selected) => {
        if (selected) {
            return chalk.yellow(value);
        }
        return value;
    },
})

const projectName = await askInput('Please enter the name of your project: ')

if (typeof projectName === 'undefined' || projectName === '@namespace/project-name') {
    console.error(chalk.red('Please enter the name of your project:'));
    process.exit(9);
}

let outputPath = 'build';
let answer = await askInput("Add custom build path if needed:")
if (answer) outputPath = answer;

const currentDirectory = path.dirname(fse.realpathSync(process.argv[1]));
const loglevelIndex = process.argv.indexOf('--loglevel');
let loglevel;

if (loglevelIndex > -1) {
    loglevel = process.argv[loglevelIndex + 1];
}

loglevel = (loglevel || 'silent');

console.log(chalk.yellow('Delete exisiting .gitkeep file'));
fse.unlink(path.resolve('.gitkeep'), () => {});

console.log(chalk.yellow('Copy files from boilerplate'));
fse.copySync(path.join(currentDirectory, `./boilerplates/${boilerplate.value}`), process.cwd());

console.log(chalk.yellow('Installing packages'));
new PackageJsonUpdater(projectName, loglevel, outputPath);