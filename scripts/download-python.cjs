const path = require('path');

const { spawn } = require('child_process');

const https = require('https');
const fs = require('fs');
const StreamZip = require('node-stream-zip');

const download = function (url, dest, cb) {
    const file = fs.createWriteStream(dest);
    const request = https
        .get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                file.close(cb); // close() is async, call cb after close completes.
            });
        })
        .on('error', function (err) {
            // Handle errors
            fs.unlink(dest); // Delete the file async. (But we don't check the result)
            if (cb) cb(err.message);
        });
};

const unzip = function (file, outPath) {
    return new Promise((resolve) => {
        const zip = new StreamZip({
            file: file,
            storeEntries: true,
        });

        zip.on('error', function (err) {
            console.error('[ERROR]', err);
        });

        zip.on('ready', function () {
            zip.extract(null, outPath, function (err, count) {
                console.log('Extracted ' + count + ' entries to ' + outPath);
                zip.close();
                resolve();
            });
        });
    });
};
const downloadPython = async () => {
    if (!fs.existsSync('temp/')) {
        fs.mkdirSync('temp/');
    }
    if (!fs.existsSync('appPython/python.exe')) {
        // Usage
        fs.mkdirSync('appPython/', { recursive: true });
        await unzip('winPy310.zip', 'appPython/');
        // download(
        //     'https://bootstrap.pypa.io/get-pip.py',
        //     'temp/get-pip.py',
        //     () => {
        //         /** @type {import('child_process').ChildProcessWithoutNullStreams } */
        //         const getPipProcess = spawn('appPython/python.exe', [
        //             'temp/get-pip.py',
        //         ]);
        //         getPipProcess.stdout.on('data', (data) => {
        //             console.log(`[get-pip] ${data}`);
        //         });

        //         getPipProcess.stderr.on('data', (data) => {
        //             console.log(`[get-pip] ${data}`);
        //         });
        //         getPipProcess.on('close', () => {
        //             const pthFile = path.join('appPython', 'python310._pth');
        //             fs.appendFile(pthFile, `Lib\\site-packages`, (err) => {
        //                 console.log('pth file saved!');
        //                 // const modulesInstall = spawn(
        //                 //     'appPython/python.exe',
        //                 //     ['-mpip', 'install', 'modules']
        //                 // );

        //                 // modulesInstall.stdout.on('data', (data) => {
        //                 //     console.log(`[get-modules] ${data}`);
        //                 // });

        //                 // modulesInstall.stderr.on('data', (data) => {
        //                 //     console.log(`[get-modules] ${data}`);
        //                 // });
        //             });
        //         });
        //     }
        // );
    }
};
module.exports = {
    downloadPython,
};
