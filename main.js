const {
    app,
    BrowserWindow,
    Menu,
    ipcMain,
    dialog
} = require('electron');

const contextMenu = require('electron-context-menu');

// context menu
contextMenu({
    showSearchWithGoogle: false
});


const {
    autoUpdater
} = require('electron-updater')

const log = require('electron-log');
const mysqldump = require('mysqldump');

const keys = require('./keys.json');

const server = require('./server');

// Check if electron is in development mode to enable Node.js on release mode 
const isEnvSet = 'ELECTRON_IS_DEV' in process.env;
const getFromEnv = Number.parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;
const isDev = isEnvSet ? getFromEnv : !app.isPackaged;
if (!isDev) {
    var node = server.listen(keys.port, () => console.log(`listening on port ${keys.port} ...`));
}


// Menu
const template = require('./menu');
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)


let win;
let printWindow;

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            nativeWindowOpen: true
        }
    });
    win.maximize();
    win.show();

    // and load the index.html of the app
    win.loadFile('application/views/login.html');

    // Emitted when the window is closed.
    win.on('closed', () => {
        win = null
    });
};

app.on('ready', () => {
    createWindow();
    const dispose = contextMenu();
    dispose();
});

app.on('window-all-closed', () => {
    if (!isDev) {
        node.close();
    }
    app.quit()
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('printDocument', function (event, data) {
    printWindow = new BrowserWindow({
        width: 1200,
        height: 1000,
        webPreferences: {
            nodeIntegration: true,
            nativeWindowOpen: true
        }
    });
    printWindow.loadFile('application/templates/print-invoice.html');
    printWindow.show();
    printWindow.webContents.on('did-finish-load', async function () {
        await printWindow.webContents.send('printDocument', data);
        printWindow.webContents.print(function() {
            printWindow.close()
        });
    })
});

ipcMain.on('closeDocument', () => {
    printWindow.close()
});


// auto update module

autoUpdater.autoDownload = false;

ipcMain.on('update', () => {
    autoUpdater.checkForUpdates();
});

ipcMain.on('download', () => {
    autoUpdater.downloadUpdate();
});

ipcMain.on('applyUpdate', () => {
    autoUpdater.quitAndInstall();
});


autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

function sendStatusToWindow(message, data) {
    if (win) {
        win.webContents.send(message, data);
    }
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('checking-for-update', 'Checking for update...');
});
autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('update-available', info);
});
autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('up-to-date', info);
});
autoUpdater.on('error', (err) => {
    sendStatusToWindow('error', err);
});
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow('downloading', progressObj);
});
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('downloaded', info);
});

ipcMain.on('backupDB', () => {
    dialog.showSaveDialog({
        defaultPath: 'medical.sql',
        properties: ['dontAddToRecent']
    }).then(function (data) {
        if (data.canceled == false) {
            mysqldump({
                connection: {
                    host: keys.host,
                    user: keys.username,
                    password: keys.password,
                    database: keys.database
                },
                dumpToFile: `${data.filePath}`
            }).then(function () {
                win.webContents.send('backup-success')
            }, function (error) {
                win.webContents.send('backup-error')
            })
        }
    })
});