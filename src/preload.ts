import { IPC_FUNC } from '@/rpc/funcNames';
import { IWebUIOptions } from './rpc';
import { IpcRendererEvent } from 'electron';
import { i18nInit } from './i18n';

const { contextBridge, ipcRenderer } = require('electron');
export const electronAPI = {
    updateWebUI: async (repoUrl: string) => {
        const result: boolean = await ipcRenderer.invoke(
            IPC_FUNC.update_webui,
            repoUrl
        );
        return result;
    },
    startWebUIService: async (options: IWebUIOptions) => {
        await ipcRenderer.invoke(IPC_FUNC.start_webui_service, options);
    },
    onWebUILogs: (cb: (evt: IpcRendererEvent, log: string) => void) => {
        ipcRenderer.on(IPC_FUNC.webui_logs, cb);
    },
} as const;
i18nInit();
contextBridge.exposeInMainWorld('electronAPI', electronAPI);
