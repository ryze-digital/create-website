import path from "node:path";
import Url from "node:url";

const __dirname = Url.fileURLToPath(new URL(".", import.meta.url));
const INSTALLER_ROOT_PATH = path.join(__dirname, "..");
const BOILERPLATE_PATH = path.join(INSTALLER_ROOT_PATH, "boilerplates");
const OUTPUT_PATH_PLACEHOLDER = "__OUTPUT_PATH__";

/**
 * Features the user can opt out of during installation. Code blocks belonging to a feature are wrapped in
 * "feature:<name>:start" and "feature:<name>:end" comment lines inside the boilerplate files.
 * @type {{[featureName: string]: {files: string[], packages: string[]}}}
 */
const OPTIONAL_FEATURES = {
    lazysizes: {
        files: ["src/scripts/lazysizes.js"],
        packages: ["lazysizes"],
    },
    ckeditor: {
        files: ["src/styles/ckeditor.scss"],
        packages: [],
    },
};

export { BOILERPLATE_PATH, OPTIONAL_FEATURES, OUTPUT_PATH_PLACEHOLDER };
