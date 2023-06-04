import { graphics } from 'systeminformation';

export type GraphicsVendorType = 'amd' | 'intel' | 'nvidia' | 'unknown';
export const AMDNameRegex = /Advanced Micro Devices|AMD/i;
export const NvidiaNameRegex = /Nvidia/i;
export const IntelNameRegex = /Intel/i;
export async function getCachedGraphics() {
    return await graphics();
}
export async function getGraphicsVendorType(): Promise<GraphicsVendorType> {
    const graphicsData = await getCachedGraphics();
    // console.log(graphicsData);
    if (graphicsData.controllers.length === 0) {
        // don't know what happened, maybe the computer has no driver?
        return 'unknown';
    }
    if (graphicsData.controllers.length > 1) {
        // multiple cards, need to test what happened or just choose one.
        console.log(`multiple card: ${graphicsData.controllers}`);
    }
    const vendorName = graphicsData.controllers[0].vendor;
    if (vendorName.match(AMDNameRegex)) {
        return 'amd';
    } else if (vendorName.match(NvidiaNameRegex)) {
        return 'nvidia';
    } else if (vendorName.match(IntelNameRegex)) {
        return 'intel';
    }

    return 'unknown';
}
export async function getGraphicVram(): Promise<number> {
    const graphicsData = await getCachedGraphics();
    return graphicsData.controllers[0].vram || 0;
}
