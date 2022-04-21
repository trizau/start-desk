import {contextBridge, ipcRenderer} from "electron";

export const api = {
    ipcRenderer
};

contextBridge.exposeInMainWorld("api", api);
