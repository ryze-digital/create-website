import chalk from 'chalk';
import child_process from 'node:child_process';
import fs from 'node:fs';

export class PackageJsonUpdater {
    /**
     * @param {string} projectName
     * @param {string} loglevel
     * @param {string} outputPath
     * @param {string} packageJsonPath
     */
    constructor(projectName, loglevel, outputPath, packageJsonPath) {
        this.projectName = projectName;
        this.loglevel = loglevel;
        this.outputPath = outputPath;
        this.packageJsonPath = packageJsonPath;

        this.editPackageJson = this.editPackageJson.bind(this);
        this.savePackageJson = this.savePackageJson.bind(this);
        this.updatePackageVersions = this.updatePackageVersions.bind(this);
    }

    /**
     * @returns {Promise<void>}
     */
    execute() {
        return this.readPackageJson()
            .then(this.editPackageJson)
            .then(this.savePackageJson)
            .then(this.updatePackageVersions);
    }

    /**
     * @returns {Promise<string>}
     */
    readPackageJson() {
        return fs.promises.readFile(this.packageJsonPath, 'utf-8');
    }

    /**
     * @param {string} data
     * @returns {Promise<object>}
     */
    editPackageJson(data) {
        return new Promise((resolve, reject) => {
            try {
                const json = JSON.parse(data);

                json.name = this.projectName;
                json.config.output = this.outputPath;

                resolve(json);
            } catch (error) {
                reject(new Error(`package.json could not be parsed to JSON because of the following error: ${error}`));
            }
        });
    }

    /**
     * @param {object} json
     * @returns {Promise<void>}
     */
    savePackageJson(json) {
        return fs.promises.writeFile(this.packageJsonPath, JSON.stringify(json, null, 2));
    }

    /**
     * @returns {void}
     */
    updatePackageVersions() {
        console.log(chalk.yellow('Running npm-check-updates to update package versions'));
        child_process.spawnSync('npm', [
            'install',
            '--no-save',
            'npm-check-updates@latest',
        ], { stdio: 'inherit' });
        child_process.spawnSync('npx', [
            'npm-check-updates',
            '--upgrade',
            '--target', 'minor',
            '--packageFile', 'package.json',
            '--loglevel', this.loglevel,
        ], { stdio: 'inherit' });

        console.log(chalk.yellow('Running npm install'));
        child_process.spawnSync('npm', ['install', '--loglevel', this.loglevel], { stdio: 'inherit' });
    }
}