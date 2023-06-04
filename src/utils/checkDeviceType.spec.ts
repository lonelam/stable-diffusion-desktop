import { getGraphicVram, getGraphicsVendorType } from './checkDeviceType';

describe('get raw graphics info', () => {
    it('run without mock should not fail', async () => {
        expect(await getGraphicsVendorType()).not.toBeUndefined();
    });
    it('run check DeviceType AMD', async () => {
        mockAmdWindowsMachine();
        expect(await getGraphicsVendorType()).toBe('amd');
    });
    it('get vram', async () => {
        mockAmdWindowsMachine();
        expect(await getGraphicVram()).toBe(8176);
    });
});

function mockAmdWindowsMachine() {
    jest.mock('systeminformation', () => ({
        graphics: () =>
            Promise.resolve({
                controllers: [
                    {
                        vendor: 'Advanced Micro Devices, Inc.',
                        model: 'Radeon RX Vega',
                        bus: 'PCI',
                        vram: 8176,
                        vramDynamic: true,
                        subDeviceId: 'E37F1DA2',
                    },
                ],
                displays: [
                    {
                        vendor: '(Standard monitor types)',
                        model: 'Generic PnP Monitor',
                        deviceName: '\\\\.\\DISPLAY1',
                        main: true,
                        builtin: false,
                        connection: 'DVI',
                        resolutionX: 1920,
                        resolutionY: 1080,
                        sizeX: 60,
                        sizeY: 34,
                        pixelDepth: 32,
                        currentResX: 1920,
                        currentResY: 1080,
                        positionX: 0,
                        positionY: 0,
                        currentRefreshRate: 60,
                    },
                ],
            }),
    }));
}
