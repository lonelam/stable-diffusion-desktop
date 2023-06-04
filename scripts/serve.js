import * as esbuild from 'esbuild';
import esbuildConfig from '../esbuild.config.mjs';
export async function serve() {
    const ctx = await esbuild.context({
        ...esbuildConfig,
    });
    await ctx.rebuild();
    await ctx.watch();
    return await ctx.serve({
        servedir: 'output',
    });
}
