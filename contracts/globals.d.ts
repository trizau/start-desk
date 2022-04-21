import {api} from "../electron/renderer";

export declare global {
    interface Window {
        api: typeof api;
    }
}
