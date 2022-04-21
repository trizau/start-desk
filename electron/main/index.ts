import {app, BrowserWindow, Menu} from "electron";
import path from "path";
import serve from "electron-serve";
import "./controller";

const loadURL = serve({directory: path.join(__dirname, '../')});

app.setAppUserModelId(app.getName());
const isDev = require("electron-is-dev");
const isMac = process.platform === 'darwin';

if (!isDev) {
    const menu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                // {role: 'about'},
                // {type: 'separator'},
                {role: 'services'},
                {type: 'separator'},
                {role: 'hide'},
                // {role: 'hideothers'},
                {role: 'minimize'},
                {role: 'togglefullscreen'},
                {role: 'unhide'},
                {type: 'separator'},
                {role: 'quit'},
            ]
        },
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
    mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            preload: path.join(__dirname, '../renderer/index.js'),
            devTools: true,
        }
    });

    mainWindow.on('ready-to-show', () => {
        mainWindow?.show();
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:3000').then(() => {
            mainWindow?.webContents.openDevTools();
        });
    } else {
        await loadURL(mainWindow);
        mainWindow.loadURL('app://index.html').then(() => {

        });
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
