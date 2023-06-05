import { polyfillNode } from 'esbuild-plugin-polyfill-node';
import { copy } from 'esbuild-plugin-copy';

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
    plugins: [
        polyfillNode({}),
        copy({
            // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
            // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
            resolveFrom: 'cwd',
            assets: {
                from: ['./public/*'],
                to: ['./output'],
            },
        }),
    ],
};
export default esbuildConfig;
