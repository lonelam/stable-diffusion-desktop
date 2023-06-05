export {};
import { type electronAPI } from '@/preload';
import { TFunction } from 'i18next';
declare global {
    interface Window {
        electronAPI: typeof electronAPI;
    }

    var t: TFunction<'translation'>;
}
