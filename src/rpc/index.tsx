import { ipcMain, webContents } from 'electron';
import { IPC_FUNC } from './funcNames';
import { getRepoPathByRepoName, initRepo } from '@/utils/git';
import { BackendManager } from '@/manager';
export { IPC_FUNC };
export interface IWebUIOptions {
    vram: 'lowvram' | 'medvram' | 'highvram';
}
export function sendWebUILogs(log: string) {
    for (const webcontents of webContents.getAllWebContents()) {
        webcontents.send(IPC_FUNC.webui_logs, log);
    }
}
export function listenAll() {
    ipcMain.handle(IPC_FUNC.update_webui, async (_, webuiGitRepo) => {
        // await cleanRepo('webui');
        try {
            await initRepo('webui', webuiGitRepo);

            return true;
        } catch (err) {
            console.log(`error on initRepo: ${err}`);
            return false;
        }
    });
    ipcMain.handle(
        IPC_FUNC.start_webui_service,
        async (_, options: IWebUIOptions) => {
            const {} = options;
            const repoPath = await getRepoPathByRepoName('webui');
            const manager = new BackendManager(repoPath);
            manager.startV1();
        }
    );
}
