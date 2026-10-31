const { app, BrowserWindow, shell, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const https = require("https");

const APPS = {
  gridforge: { name: "GridForge", category: "Calendar & planning", description: "Plan your time, manage schedules, and organize events.", url: "https://moswebgr.github.io/Office/gridforge/", file: "gridforge/index.html" },
  slidespark: { name: "SlideSpark", category: "Presentations", description: "Create, edit, and present your slide decks.", url: "https://moswebgr.github.io/Office/slidespark/", file: "slidespark/index.html" },
  datanest: { name: "DataNest", category: "Data & tables", description: "Keep information structured with tables and records.", url: "https://moswebgr.github.io/Office/datanest/", file: "datanest/index.html" },
  mailnest: { name: "MailNest", category: "Email", description: "Work with your Outlook mailbox and local drafts.", url: "https://moswebgr.github.io/Office/mailnest/", file: "mailnest/index.html" }
};
const ROOT = "https://raw.githubusercontent.com/moswebgr/Office/main/";
const SHARED_FILES = ["index.html", "assets/microsoft-ui.css", "assets/responsive.css", "assets/desktop-only.css", "assets/mossuite-logo.svg", "assets/microsoft-auth.js"];

function appDir() { return path.join(app.getPath("userData"), "offline-apps"); }
function download(url, destination, redirects = 5) {
  return new Promise((resolve, reject) => {
    https.get(url, response => {
      if ([301,302,303,307,308].includes(response.statusCode) && response.headers.location && redirects) {
        response.resume();
        return resolve(download(new URL(response.headers.location, url).toString(), destination, redirects - 1));
      }
      if (response.statusCode !== 200) {
        response.resume();
        return reject(new Error("Download failed: HTTP " + response.statusCode + " (" + url + ")"));
      }
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      const temp = destination + ".tmp";
      const file = fs.createWriteStream(temp);
      response.pipe(file);
      file.on("finish", () => file.close(() => {
        try { fs.renameSync(temp, destination); resolve(destination); }
        catch (err) { fs.rmSync(temp, {force:true}); reject(err); }
      }));
      file.on("error", err => { fs.rmSync(temp, {force:true}); reject(err); });
    }).on("error", reject);
  });
}
function appEntry(id) { return path.join(appDir(), id, ...APPS[id].file.split("/")); }
function isInstalled(id) { return fs.existsSync(appEntry(id)) && fs.existsSync(path.join(appDir(), id, "assets", "mossuite-logo.svg")); }

ipcMain.handle("apps:list", () => Object.entries(APPS).map(([id, item]) => ({
  id, name:item.name, category:item.category, description:item.description, installed:isInstalled(id)
})));

ipcMain.handle("apps:install", async (_event, id) => {
  const item = APPS[id];
  if (!item) throw new Error("Unknown app");
  const base = path.join(appDir(), id);
  await download(ROOT + item.file, appEntry(id));
  for (const file of SHARED_FILES) {
    await download(ROOT + file, path.join(base, ...file.split("/")));
  }
  return {id, installed:true};
});

ipcMain.handle("apps:open", async (_event, id) => {
  const item = APPS[id];
  if (!item) throw new Error("Unknown app");
  if (isInstalled(id)) {
    const win = new BrowserWindow({
      width:1200,height:820,minWidth:800,minHeight:600,title:"MosSuite · " + item.name,
      autoHideMenuBar:true,backgroundColor:"#111827",
      webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true}
    });
    win.webContents.setWindowOpenHandler(({url}) => {
      if (url.startsWith("https://") || url.startsWith("http://")) shell.openExternal(url);
      return {action:"deny"};
    });
    await win.loadFile(appEntry(id));
    return {offline:true};
  }
  await shell.openExternal(item.url);
  return {offline:false};
});

function createWindow() {
 const win = new BrowserWindow({
   width:1180,height:820,minWidth:780,minHeight:620,title:"MosSuite Launcher",
   icon:path.join(__dirname,"assets","icon.png"),backgroundColor:"#0b1020",autoHideMenuBar:true,
   webPreferences:{preload:path.join(__dirname,"preload.cjs"),contextIsolation:true,nodeIntegration:false,sandbox:true}
 });
 win.loadFile(path.join(__dirname,"app","index.html"));
}
app.whenReady().then(()=>{app.setName("MosSuite");createWindow();app.on("activate",()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});});
app.on("window-all-closed",()=>{if(process.platform!=="darwin")app.quit();});
