import {app, BrowserWindow, Menu} from "electron";
import path from "path";
import serve from "electron-serve";
import "./controller";

__dirname = __dirname.replace('/electron/', '/build/');

const loadURL = serve({directory: path.resolve(__dirname, '../')});

app.setAppUserModelId(app.getName());
const isDev = require("electron-is-dev");
const isMac = process.platform === 'darwin';

if (!isDev) {
    const menu = Menu.buildFromTemplate([
        {role: "appMenu"},
        {role: "editMenu"},
    ]);
    Menu.setApplicationMenu(isMac ? menu : null);
}

let mainWindow: BrowserWindow | undefined;

// 防止多开
if (!app.requestSingleInstanceLock()) {
    app.quit();
} else {
    app.on('second-instance', () => {
        mainWindow?.restore();
        mainWindow?.focus();
    });
}

async function create_window() {
    if (require('electron-squirrel-startup')) return app.quit();
    mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            preload: path.resolve(__dirname, '../renderer/index.js'),
            devTools: isDev,
        }
    });

    mainWindow.on('ready-to-show', () => {
        mainWindow?.show();
    });

    if (isDev) {
        await mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        await loadURL(mainWindow);
        await mainWindow.loadURL('app://index.html');
    }
}


app.on('ready', async () => {
    await create_window();

    app.on('activate', () => {
        if (isMac) {
            if (!BrowserWindow.getAllWindows().length) {
                create_window();
            }
        }
    });
});

app.on('window-all-closed', () => {
    app.quit();
});
