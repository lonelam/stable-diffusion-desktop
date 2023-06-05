/** @type {import("electron-builder").Configuration} */
const electronBuilderConfig = {
    appId: 'laizn.stable-diffusion-desktop',
    mac: {
        category: 'public.app-category.productivity',
        target: 'dmg',
    },
    productName: 'Stable Diffusion Desktop',
    icon: 'assets/icon.ico',
    files: ['output/**/*', 'locale/**/*'],
    extraFiles: ['appPython/**/*', 'appGit/**/*', 'assets/**/*'],
};
module.exports = electronBuilderConfig;
