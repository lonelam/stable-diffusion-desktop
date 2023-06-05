import chalk from 'chalk';
import { app } from 'electron';
import { mkdir, existsSync } from 'fs';
import * as path from 'path';
import { rimraf } from 'rimraf';
import simpleGit from 'simple-git';
import { promisify } from 'util';
import { getAppProgramPath } from './environmentPaths';
export const getGitPath = () => {
    if (process.platform === 'win32') {
        return path.join(getAppProgramPath(), 'appGit', 'bin', 'git.exe');
    }
    return 'git';
};

export const getWebUIRepoRootPath = () => {
    return new Promise<string>((resolve) => {
        const rootPath = path.join(
            app.getPath('appData'),
            app.getName(),
            'repos'
        );
        if (!existsSync(rootPath)) {
            mkdir(rootPath, { recursive: true }, (err) => {
                if (!err) {
                    resolve(rootPath);
                }
            });
        } else {
            resolve(rootPath);
        }
    });
};
export async function getRepoPathByRepoName(repoName: string) {
    const rootPath = await getWebUIRepoRootPath();
    const repoPath = path.join(rootPath, repoName);
    return repoPath;
}

export async function cleanRepo(repoName: string) {
    const repoPath = await getRepoPathByRepoName(repoName);
    return new Promise<void>(async (resolve, reject) => {
        console.log(`rimraf: ${repoPath}`);
        const result = await rimraf(repoPath).catch((err) => {
            reject(err);
            return false;
        });
        if (result) {
            resolve();
        } else {
            reject();
        }
    });
}

export async function updateRepo(repoName: string) {
    const repoPath = await getRepoPathByRepoName(repoName);

    const git = simpleGit({
        binary: getGitPath(),
        baseDir: repoPath,
    });
    const isRepo = await git.checkIsRepo();
    if (isRepo) {
        const remoteResult = await git.remote(['get-url', 'origin']);
        // console.log(remoteResult);
        if (remoteResult) {
            const pullResult = await git.pull();
            console.log(pullResult.summary);
            const updateResult = await git.submoduleUpdate();
            console.log(updateResult);
            return true;
        }
    }
    return false;
}
export async function initRepo(
    repoName: string,
    repoUrl: string
): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const repoPath = await getRepoPathByRepoName(repoName);

            if (existsSync(repoPath)) {
                if (await updateRepo(repoName)) {
                    resolve();
                    return;
                }
                throw new Error(
                    `repo already exist at ${repoPath}, clean it before`
                );
            }

            const mkdirResultPath = await promisify(mkdir)(repoPath, {
                recursive: true,
            });
            if (mkdirResultPath !== repoPath) {
                throw new Error(
                    `repo mkdir failed at ${repoPath}, the created result is ${mkdirResultPath}`
                );
            }
            const git = simpleGit({
                binary: getGitPath(),
                baseDir: repoPath,
            });
            console.log(chalk.bgYellow(`git clone -v ${repoUrl} ${repoPath}`));

            const cloneDataResult = await git
                .outputHandler((cmd, stdout, stderr) => {
                    console.log(chalk.green(`[Git] git running ${cmd}`));
                    stdout.on('data', (data) => {
                        console.log(chalk.green(`[Git] ${data}`));
                    });
                    stderr.on('data', (data) => {
                        console.log(chalk.red(`[Git] ${data}`));
                    });
                })
                .clone(repoUrl, repoPath, ['--verbose']);
            await git.submoduleInit();
            await git.submoduleUpdate();
            console.log(
                chalk.blue(
                    `Git process exited successfully with result ${cloneDataResult}`
                )
            );
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}
