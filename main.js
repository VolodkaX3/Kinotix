const { app, BrowserWindow, screen, Tray, nativeImage, Menu } = require("electron");
const path = require("path");
const fs = require("fs");

let splashWindow = null;
let mainWindow = null;
let tray = null;

function createSplash() {
  splashWindow = new BrowserWindow({
    width: 600,
    height: 424,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    skipTaskbar: true,
    center: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  splashWindow.loadFile(path.join(__dirname, "renderer", "splash.html"));

  setTimeout(() => {
    createMainWindow();
    //mainWindow.maximize();
    mainWindow.show();
    if (splashWindow) {
      splashWindow.close();
      splashWindow = null;
    }
  }, 3000);
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    width: 1280,
    height: 905,
    minWidth: 900,
    minHeight: 600,
    show: false,
    backgroundColor: "#0b0b12",
    title: "Kinotix",
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));

  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.type === "keyDown" && input.key === "Escape") {
      mainWindow.close();
    }
  });

}

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.show();
  mainWindow.focus();
}

app.whenReady().then(() => {
  createSplash();
    let icon = nativeImage.createFromPath(path.join(__dirname, "img_a/traylogo1.png"));
    icon = icon.resize({ width: 22, height: 22 });
    icon.setTemplateImage(false);
    tray = new Tray(icon);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Show",
            click: () => showMainWindow()
        },
        {
            type: "separator"
        },
        {
            label: "Exit",
            click: () => app.quit()
        }
    ])

    tray.setContextMenu(contextMenu);
    });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});