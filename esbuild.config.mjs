import { polyfillNode } from 'esbuild-plugin-polyfill-node';

/** @type {import("esbuild").BuildOptions} */
const esbuildConfig = {
    entryPoints: ['src/index.tsx'],
    outdir: 'output',
    bundle: true,
    target: 'chrome114',
    external: [
        'clipboard',
        'crash-reporter',
        'electron',
        'ipc',
        'native-image',
        'original-fs',
        'screen',
        'shell',
    ],
    platform: 'browser',
    plugins: [polyfillNode({})],
};
export default esbuildConfig;
