import fs from 'node:fs';
import util from 'node:util';
import path from 'node:path';
import shell from 'shelljs';
import chalk from 'chalk';

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

        this.init();
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
                reject(new Error('package.json could not be parsed to JSON'));
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
        shell.exec(`npx npm-check-updates --target minor --upgrade --packageFile package.json --loglevel ${this.loglevel}`, () => {
            shell.exec(`npm install --loglevel ${this.loglevel}`, () => {
                console.info(chalk.green('Adventure ready'));
            });
        });
    }

    init() {
        this.readPackageJson()
            .then(this.editPackageJson)
            .then(this.savePackageJson)
            .then(this.updatePackageVersions)
            .catch((error) => {
                console.error(chalk.red(error));
            });
    }
}

export {
    PackageJsonUpdater
};