import { serve } from './serve.js';
import { ChildProcess, spawn, exec, execSync } from 'node:child_process';
import { default as chalk } from 'chalk';
import { fromEvent } from 'rxjs';
import webpack from 'webpack';
import webpackConfig from '../webpack.config.js';
import preloadWebpackConfig from '../preload.webpack.config.js';
import path from 'node:path';
const exitSig$ = fromEvent(process, 'SIGINT');
/** @type {ChildProcess} */
let childElectron = null;
/** @type {ChildProcess} */
let childTsc = null;
process.on('SIGINT', function () {
    console.log('Caught interrupt signal');
    if (childElectron) {
        let electronKilled = false;
        if (process.platform === 'win32') {
            electronKilled = true;
            execSync(
                'taskkill /pid ' + childElectron.pid + ' /T /F',
                function (error, stdout, stderr) {
                    // Log any errors:
                    if (error) console.error(`exec error: ${error}`);
                    electronKilled = false;
                }
            );
        } else {
            electronKilled = childElectron.kill('SIGINT');
        }
        if (electronKilled) {
            console.log(`electron killed`);
        }
    }
    childTsc?.kill('SIGINT');
    // Perform your cleanup here

    // If you don't call process.exit(), the program will not terminate
    process.exit();
});

async function runElectron() {
    childElectron = spawn(
        process.platform === 'win32'
            ? '.\\node_modules\\.bin\\electron.cmd'
            : './node_modules/.bin/electron',
        ['.'],
        {
            env: {
                ...process.env,
                APPDATA: 'testApp/appData/',
            },
        }
    );

    childElectron.stdout.on('data', (data) => {
        console.log(chalk.bgGreenBright(`[Electron] ${data}`));
    });

    childElectron.stderr.on('data', (data) => {
        console.log(chalk.bgRed(`[Electron] ${data}`));
    });

    childElectron.on('close', (code) => {
        if (code === 0) {
            console.log(
                chalk.blue(
                    `Electron process exited successfully with code ${code}`
                )
            );
        } else {
            console.log(chalk.red(`Electron process exited with code ${code}`));
        }
        // spawn again;
        // console.log(
        //     chalk.yellowBright(
        //         `Electron process exited, restarting, to exit development, use Ctrl+C`
        //     )
        // );
        // setTimeout(runElectron, 5000);
    });
}
async function tscWithWatch() {
    return new Promise((resolve) => {
        childTsc = spawn('./node_modules/.bin/tsc', [
            '-p',
            'tsconfig.main.json',
            '-w',
        ]);

        childTsc.stdout.on('data', (/** @type {string} */ data) => {
            console.log(chalk.green(`[Main Tsc] ${data}`));
            if (data.includes('Watching for file changes.')) {
                resolve();
            }
        });

        childTsc.stderr.on('data', (data) => {
            console.log(chalk.red(`[Main Tsc] ${data}`));
        });

        childTsc.on('close', (code) => {
            if (code === 0) {
                console.log(
                    chalk.blue(
                        `Main Tsc process exited successfully with code ${code}`
                    )
                );
            } else {
                console.log(
                    chalk.red(`Main Tsc process exited with code ${code}`)
                );
            }
        });
    });
}

async function webpackWithWatch(config) {
    return new Promise((resolve) => {
        const compiler = webpack(config);
        let firstComplete = false;
        const watching = compiler.watch(
            {
                aggregateTimeout: 300,
                poll: undefined,
            },
            (err, stats) => {
                if (err) {
                    console.error(err);
                } else {
                    if (!firstComplete) {
                        console.log(
                            chalk.blue(
                                'First webpack compile for main.js completed'
                            )
                        );
                        firstComplete = true;
                        resolve();
                    }
                }
            }
        );
    });
}

async function dev() {
    const serveResult = await serve();
    // await tscWithWatch();
    await Promise.all([
        webpackWithWatch(preloadWebpackConfig),
        webpackWithWatch(webpackConfig),
    ]);
    runElectron();
}

dev();
