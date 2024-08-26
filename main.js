const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  Menu,
  shell,
} = require("electron");


// Menu
const template = require("./menu");
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

const path = require("path");
const fs = require("fs");
const db = require("./database");
const moment = require("moment");
const { machineIdSync } = require("node-machine-id");
const contextMenu = require("electron-context-menu");

contextMenu({
  showSaveImageAs: false,
  showSearchWithGoogle: false,
  showInspectElement: false,
  showSelectAll: false,
  showCopyImage: false,
});

const mysqldump = require("mysqldump");

// Check if electron is in development mode to enable Node.js on release mode

var node; //
const isEnvSet = "ELECTRON_IS_DEV" in process.env;
const getFromEnv = Number.parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;
const isDev = isEnvSet ? getFromEnv : !app.isPackaged;
if (!isDev) {
  // require server
  const server = require("../server");
  node = server.listen(3000, () =>
    console.log(`listening on port ${3000} ...`)
  );
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.maximize();
  win.show();

  let ID = machineIdSync({
    original: true,
  });

  if (isDev) {
    win.loadFile("app/index.html");
  } else {
    if (ID == "1a6bac19-5839-4dd9-8a42-4415e6858be3" || ID == "9091e364-efbd-4db5-873d-4143a7931661") {
		win.loadFile("app/index.html");
	  } else {
		win.loadFile("error.html");
	  }
  }

  // require update module
  const updater = require("./update");
  updater(win, ipcMain);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (!isDev) {
      node.close();
    }
    app.quit();
  }
});

ipcMain.handle("backupDB", () => {
  return dialog
    .showSaveDialog({
      defaultPath: "database.sql",
      properties: ["dontAddToRecent"],
    })
    .then(function (data) {
      if (data.canceled == false) {
        return mysqldump({
          connection: {
            host: "localhost",
            user: "root",
            password: "roottoor",
            database: "vet",
          },
          dumpToFile: `${data.filePath}`,
        }).then(
          function () {
            return "success";
          },
          function (error) {
            return error;
          }
        );
      } else {
        return "canceled";
      }
    });
});

// read package info
ipcMain.handle("read-package", function () {
  let data = require("./package.json");
  return data;
});


// print window
let printWindow;
ipcMain.handle("print-invoice", async (event, data) => {
  printWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const printOptions = {
    silent: false, // Print without showing a dialog (optional)
    marginsType: 0, // Set margin type (optional)
  };
  printWindow.loadFile("app/templates/print-invoice.html");
  printWindow.show();
  printWindow.webContents.on("did-finish-load", async function () {
    await printWindow.webContents.send("printDocument", data);
    printWindow.webContents.print(printOptions, success => {
      printWindow.close();
    });
  });
});
