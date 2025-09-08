import chalk from 'chalk';
import child_process from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import util from 'node:util';

class PackageJsonUpdater {
    /**
     *
     * @param {string} projectName
     * @param {string} loglevel
     * @param {string} outputPath
     * @param {string} packageJsonPath
     */
    constructor(projectName, loglevel, outputPath, packageJsonPath = path.resolve('package.json')) {
        this.packageJsonPath = packageJsonPath;
        this.projectName = projectName;
        this.loglevel = loglevel;
        this.outputPath = outputPath;

        this.readFile = util.promisify(fs.readFile);
        this.writeFile = util.promisify(fs.writeFile);

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
     *
     * @returns {Function}
     */
    readPackageJson() {
        return this.readFile(this.packageJsonPath);
    }

    /**
     *
     * @param {object} data
     * @returns {Promise}
     */
    editPackageJson(data) {
        return new Promise((resolve, reject) => {
            try {
                const json = JSON.parse(data.toString());

                json.name = this.projectName;
                json.config.output = this.outputPath;

                resolve(json);
            } catch (error) {
                reject(new Error(`package.json could not be parsed to JSON because of the following error: ${error}`));
            }
        });
    }

    /**
     *
     * @param {json} json
     * @returns {Function}
     */
    savePackageJson(json) {
        return this.writeFile(this.packageJsonPath, JSON.stringify(json, null, 2));
    }

    updatePackageVersions() {
        child_process.spawnSync('npx', [
            'npm-check-updates',
            '--upgrade',
            '--target', 'minor',
            '--packageFile', 'package.json',
            '--loglevel', this.loglevel,
        ], { stdio: 'inherit' });
        child_process.spawnSync('npm', ['install', '--loglevel', this.loglevel], { stdio: 'inherit' });
    }
}

export {
    PackageJsonUpdater,
};
