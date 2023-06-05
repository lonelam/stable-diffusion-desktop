import { app } from 'electron';
import path from 'path';
export const getAppProgramPath = () => {
    if (process.execPath.includes('node_modules')) {
        return app.getAppPath();
    }
    return path.dirname(process.execPath);
};
export const getPythonAccelerate = () => {
    if (process.platform === 'win32') {
        return path.join(
            getAppProgramPath(),
            'appPython',
            'Scripts',
            'accelerate.exe'
        );
    }
    return '';
};
export const getPythonPath = () => {
    if (process.platform === 'win32') {
        return path.join(getAppProgramPath(), 'appPython', 'python.exe');
    }
    return path.join(getAppProgramPath(), 'appPython', 'python');
};
export const getPythonPathEnvironmentVariable = () => {
    const pythonRootPath = getPythonPath();
    if (process.platform === 'win32') {
        return [
            path.join(pythonRootPath, 'DLLs'),
            path.join(pythonRootPath, 'Lib'),
            path.join(pythonRootPath, 'Lib', 'site-packages'),
            path.join(pythonRootPath, 'Lib', 'plat-win'),
        ].join(';');
    }
    return '';
};
