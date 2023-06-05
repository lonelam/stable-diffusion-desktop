import { app, BrowserWindow, Menu, Tray } from 'electron';
import * as path from 'path';
import { listenAll } from './rpc';
import { i18nInit } from './i18n';
import { t } from 'i18next';
import { closeAllBackends } from './manager';
import { getAppProgramPath } from './utils/environmentPaths';
import { isDevelopment } from './utils';
const isPrimary = app.requestSingleInstanceLock();
if (!isPrimary) {
    console.log('another instance of application started');
    process.exit(-1);
}

i18nInit();
let launchViewWindow: BrowserWindow | null;
const createWindow = () => {
    if (launchViewWindow) {
        launchViewWindow.show();
        return;
    } else {
        const win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                nodeIntegration: true,
            },
            autoHideMenuBar: true,
        });
        win.on('close', () => {
            closeAllBackends();
        });
        win.on('minimize', () => {
            win.hide();
        });
        if (isDevelopment()) {
            win.webContents.openDevTools();
        }

        win.loadFile(path.join(__dirname, './index.html'));
        launchViewWindow = win;
    }
};

app.whenReady().then(() => {
    createWindow();
    const tray = new Tray(path.join(getAppProgramPath(), 'assets', 'icon.ico'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: t('launch_view'),
            type: 'normal',
            click: () => {
                createWindow();
            },
        },
        { label: t('configuration_view'), type: 'normal' },
        {
            label: t('exit'),
            type: 'normal',
            click: async () => {
                await closeAllBackends();
                process.exit();
            },
        },
    ]);
    tray.setContextMenu(contextMenu);
    tray.setToolTip(t('stable_diffusion_launcher'));
});
listenAll();
process.on('beforeExit', () => {
    closeAllBackends();
});
