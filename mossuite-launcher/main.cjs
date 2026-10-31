const { app, BrowserWindow, shell, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const https = require("https");
const APPS = {
  gridforge: { name: "GridForge", url: "https://moswebgr.github.io/Office/gridforge/" },
  slidespark: { name: "SlideSpark", url: "https://moswebgr.github.io/Office/slidespark/" },
  datanest: { name: "DataNest", url: "https://moswebgr.github.io/Office/datanest/" },
  mailnest: { name: "MailNest", url: "https://moswebgr.github.io/Office/mailnest/" }
};
const appDir = () => path.join(app.getPath("userData"), "offline-apps");
function download(url, destination, redirects = 5) {
  return new Promise((resolve, reject) => {
    https.get(url, response => {
      if ([301,302,303,307,308].includes(response.statusCode) && response.headers.location && redirects) {
        response.resume(); return resolve(download(response.headers.location, destination, redirects - 1));
      }
      if (response.statusCode !== 200) { response.resume(); return reject(new Error("Download failed: HTTP " + response.statusCode)); }
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      const temp = destination + ".tmp";
      const file = fs.createWriteStream(temp);
      response.pipe(file);
      file.on("finish", () => file.close(() => { fs.renameSync(temp, destination); resolve(destination); }));
      file.on("error", err => { fs.rmSync(temp, {force:true}); reject(err); });
    }).on("error", reject);
  });
}
ipcMain.handle("apps:list", () => Object.entries(APPS).map(([id, item]) => ({id,name:item.name,installed:fs.existsSync(path.join(appDir(),id,"index.html"))})));
ipcMain.handle("apps:install", async (_event, id) => {
  const item = APPS[id]; if (!item) throw new Error("Unknown app");
  const target = path.join(appDir(), id, "index.html");
  await download(item.url, target);
  return {id, installed:true};
});
ipcMain.handle("apps:open", async (_event, id) => {
  const item = APPS[id]; if (!item) throw new Error("Unknown app");
  const local = path.join(appDir(), id, "index.html");
  if (fs.existsSync(local)) {
    const win = new BrowserWindow({width:1200,height:820,minWidth:800,minHeight:600,title:item.name,autoHideMenuBar:true,webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true}});
    await win.loadFile(local);
    return {offline:true};
  }
  await shell.openExternal(item.url);
  return {offline:false};
});
function createWindow() {
 const win = new BrowserWindow({width:1100,height:780,minWidth:760,minHeight:560,title:"MosSuite",icon:path.join(__dirname,"assets","icon.png"),backgroundColor:"#10131b",autoHideMenuBar:true,webPreferences:{preload:path.join(__dirname,"preload.cjs"),contextIsolation:true,nodeIntegration:false,sandbox:true}});
 win.loadFile(path.join(__dirname,"app","index.html"));
}
app.whenReady().then(()=>{app.setName("MosSuite");createWindow();app.on("activate",()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});});
app.on("window-all-closed",()=>{if(process.platform!=="darwin")app.quit();});
