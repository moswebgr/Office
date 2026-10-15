const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');

function createWindow() {
  const iconPath = app.isPackaged
    ? path.join(__dirname, 'build', 'icon.png')
    : path.join(__dirname, '..', 'SlideSpark.png');
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 680,
    title: 'SlideSpark — MosSuite',
    icon: iconPath,
    backgroundColor: '#101114',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  win.loadFile(path.join(__dirname, 'app', 'index.html'));
  win.webContents.on('will-navigate', (event, url) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
