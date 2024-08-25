const {
    autoUpdater
} = require('electron-updater')

const log = require('electron-log')


module.exports = (win, ipcMain) => {

    // auto update module

    autoUpdater.autoDownload = false;

    ipcMain.handle('update', () => {
        sendStatusToWindow('checking-for-update', 'Checking for update...');
        autoUpdater.checkForUpdates();
    });

    ipcMain.handle('download', () => {
        autoUpdater.downloadUpdate();
    });

    ipcMain.handle('applyUpdate', () => {
        autoUpdater.quitAndInstall();
    });


    autoUpdater.logger = log;
    autoUpdater.logger.transports.file.level = 'info';

    async function sendStatusToWindow(message, data) {
        if (win) {
            await win.webContents.send(message, data);
            // win.ipcMain.send(message, data)
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
}