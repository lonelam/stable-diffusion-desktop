import { sendWebUILogs } from '@/rpc';
import { getPythonPath } from '@/utils/environmentPaths';
import { getGitPath } from '@/utils/git';
import chalk from 'chalk';
import { spawn } from 'child_process';
import { type IPty } from 'node-pty';
import path from 'path';
const nodePty = require('node-pty');
const backEnds: BackendManager[] = [];
export function closeAllBackends() {
    return Promise.all(
        backEnds.map((be) => {
            return be.endProcess();
        })
    );
}
export class BackendManager {
    private webuiScriptPath: string;
    childProcess: IPty | null = null;

    constructor(private repoPath: string) {
        if (process.platform === 'win32') {
            this.webuiScriptPath = path.join(repoPath, 'launch.py');
        } else {
            this.webuiScriptPath = path.join(repoPath, 'webui.sh');
        }
        backEnds.push(this);
    }

    async endProcess() {
        if (!this.childProcess) {
            return;
        }
        return new Promise<void>(async (resolve) => {
            const taskKill = await spawn('taskkill', [
                '/pid',
                String(this.childProcess?.pid),
                ' /T',
                '/F',
            ]);
            taskKill.on('close', (code) => {
                if (code === 0) {
                } else {
                    console.log(`exit failed: ${code}`);
                    this.childProcess?.kill('SIGINT');
                }
                resolve();
            });
        });
    }
    startV1() {
        this.childProcess = nodePty.spawn(
            getPythonPath(),
            [this.webuiScriptPath],
            {
                cols: 80,
                rows: 30,
                cwd: this.repoPath,
                env: {
                    ...process.env,
                    PYTHON: path.join(getPythonPath()),
                    GIT: getGitPath(),
                    COMMANDLINE_ARGS:
                        '--medvram --precision full --no-half --opt-sub-quad-attention --disable-nan-check --enable-console-prompts',
                },
            }
        );

        this.childProcess!.onData((data) => {
            console.log(chalk.green(`[WebUI] ${data}`));
            sendWebUILogs(String(data));
        });
    }
}
