import * as esbuild from 'esbuild';
import esbuildConfig from '../esbuild.config.mjs';
import config from '../webpack.config.js';
import webpack from 'webpack';
import preloadWebpackConfig from '../preload.webpack.config.js';
async function build() {
    await esbuild.build({
        ...esbuildConfig,
    });
    const mainCompiler = webpack(config, (err, stats) => {
        console.log(`[webpack] ${err}${stats}`);
    });
    const preloadCompiler = webpack(preloadWebpackConfig, (err, stats) => {
        console.log(`[webpack] ${err}${stats}`);
    });
    mainCompiler.compile((err, result) => {
        if (err) {
            console.error(`main script failed: ${err}`);
        } else {
            console.log(`main.js Compiled!`);
        }
    });
    preloadCompiler.compile((err) => {
        if (err) {
            console.error(`preload script failed ${err}`);
        } else {
            console.log('preload.js Compiled!');
        }
    });
}
build();
