const { app, BrowserWindow } = require("electron");
const path = require("path");

let splashWindow = null;
let mainWindow = null;

function createSplash() {
  splashWindow = new BrowserWindow({
    width: 500,
    height: 300,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    center: true,
    show: false,
  });
  splashWindow.loadFile(path.join(__dirname, "renderer", "splash.html"));
  splashWindow.once("ready-to-show", () => splashWindow.show());
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    backgroundColor: "#0b0b12",
    title: "Kinotix",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));

  return new Promise((resolve) => mainWindow.once("ready-to-show", resolve));
}

app.whenReady().then(async () => {
  createSplash();

  const minSplashTime = new Promise((resolve) => setTimeout(resolve, 2500));
  const mainReady = createMainWindow();

  await Promise.all([minSplashTime, mainReady]);

  mainWindow.show();
  if (splashWindow) {
    splashWindow.close();
    splashWindow = null;
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});