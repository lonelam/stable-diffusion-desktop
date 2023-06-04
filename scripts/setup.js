import { downloadPython } from './download-python.cjs';
import { downloadGit } from './download-git.cjs';
const setupPython = () => {
    if (process.platform === 'win32') {
        downloadPython();
    }
};
const setupGit = () => {
    if (process.platform === 'win32') {
        downloadGit();
    }
};
setupPython();
setupGit();
