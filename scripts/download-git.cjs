// import * as https from 'https';
const https = require('https');
// import * as fs from 'fs';
const fs = require('fs');
const { execSync, spawn } = require('child_process');
const download = function (url, dest, cb) {
    const file = fs.createWriteStream(dest);
    const request = https
        .get(url, function (response) {
            if (response.statusCode === 302) {
                file.close();
                download(response.headers.location, dest, cb);
            } else {
                response.pipe(file);
                file.on('finish', function () {
                    file.close(cb); // close() is async, call cb after close completes.
                });
            }
        })
        .on('error', function (err) {
            // Handle errors
            fs.unlink(dest); // Delete the file async. (But we don't check the result)
            if (cb) cb(err.message);
        });
};

const downloadGit = () => {
    if (!fs.existsSync('temp/')) {
        fs.mkdirSync('temp/');
    }
    if (!fs.existsSync('appGit/git-cmd.exe')) {
        // Usage
        download(
            'https://github.com/git-for-windows/git/releases/download/v2.41.0.windows.1/PortableGit-2.41.0-64-bit.7z.exe',
            'temp/git.7z.exe',
            function (message) {
                console.log(message);
                fs.mkdirSync('appGit/', {
                    recursive: true,
                });
                const child = spawn('helper\\7zr.exe', [
                    'x',
                    'temp\\git.7z.exe',
                    '-oappGit/',
                    '-y',
                    '-bb3',
                ]);
                child.stdout.on('data', (data) => {
                    console.log(`[7zip] ${data}`);
                });

                child.stderr.on('data', (data) => {
                    console.log(`[7zip] ${data}`);
                });
            }
        );
    }
};

module.exports = { downloadGit };
