/** @type {import("electron-builder").Configuration} */
const electronBuilderConfig = {
    appId: 'laizn.stable-diffusion-desktop',
    mac: {
        category: 'public.app-category.productivity',
        target: 'dmg',
    },
    productName: 'Stable Diffusion Desktop',
    icon: 'assets/icon.ico',
    extraFiles: ['appPython/**/*', 'appGit/**/*', 'locale/**/*'],
};
module.exports = electronBuilderConfig;
