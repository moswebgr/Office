const { app, BrowserWindow } = require("electron");
app.whenReady().then(() => { const win = new BrowserWindow({ width: 1000, height: 700 }); win.loadFile("app/index.html"); });
