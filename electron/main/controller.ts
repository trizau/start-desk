import {ipcMain} from "electron";

ipcMain.handle('message', (event, args) => {
    return 'This is main process and args is: ' + args;
});
