import * as esbuild from 'esbuild';
import esbuildConfig from '../esbuild.config.mjs';
async function build() {
    await esbuild.build({
        ...esbuildConfig,
    });
}
build();
