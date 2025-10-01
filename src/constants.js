import path from 'node:path';
import Url from 'node:url';

const __dirname = Url.fileURLToPath(new URL('.', import.meta.url));
const INSTALLER_ROOT_PATH = path.join(__dirname, '..');
const BOILERPLATE_PATH = path.join(INSTALLER_ROOT_PATH, 'boilerplates');

export {
    BOILERPLATE_PATH,
};
