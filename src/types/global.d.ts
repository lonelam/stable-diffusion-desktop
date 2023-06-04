export {};
import { type electronAPI } from '@/preload';
declare global {
    interface Window {
        electronAPI: typeof electronAPI;
    }
}
