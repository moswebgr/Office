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
const SHARED_FILES = ["index.html", "assets/microsoft-ui.css", "assets/responsive.css", "assets/desktop-only.css", "assets/mossuite-logo.svg", "assets/microsoft-auth.js", "assets/mossuite-modern.css", "gridforge.png", "SlideSpark.png", "datanest-removebg-preview.png", "mailnest.jpg"];

function appDir() { return path.join(app.getPath("userData"), "offline-apps"); }
function desktopEntryPath(id) { return path.join(app.getPath("home"), ".local", "share", "applications", "mossuite-" + id + ".desktop"); }
function createDesktopEntry(id, item) {
  const launcher = (process.env.APPIMAGE || process.execPath).replace(/"/g, '\\"');
  const iconDir = path.join(app.getPath("home"), ".local", "share", "icons", "hicolor", "256x256", "apps");
  fs.mkdirSync(iconDir, { recursive: true });
  const icon = path.join(iconDir, "mossuite.png");
  fs.copyFileSync(path.join(__dirname, "assets", "icon.png"), icon);
  const content = [
    "[Desktop Entry]",
    "Type=Application",
    "Name=" + item.name,
    "Comment=" + item.description,
    'Exec="' + launcher + '" --app ' + id,
    'Icon=' + icon,
    "Terminal=false",
    "Categories=Office;",
    "StartupNotify=true",
    "StartupWMClass=MosSuite-" + id,
    ""
  ].join("\n");
  const target = desktopEntryPath(id);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, { mode: 0o755 });
  try { fs.chmodSync(target, 0o755); } catch {}
}
function download(url, destination, onProgress, redirects = 5) {
  return new Promise((resolve, reject) => {
    https.get(url, response => {
      if ([301,302,303,307,308].includes(response.statusCode) && response.headers.location && redirects) {
        response.resume();
        return resolve(download(new URL(response.headers.location, url).toString(), destination, onProgress, redirects - 1));
      }
      if (response.statusCode !== 200) {
        response.resume();
        return reject(new Error("Download failed: HTTP " + response.statusCode + " (" + url + ")"));
      }
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      const temp = destination + ".tmp";
      const file = fs.createWriteStream(temp);
      let receivedBytes = 0;
      const totalBytes = Number(response.headers["content-length"]) || 0;
      response.on("data", chunk => { receivedBytes += chunk.length; if (onProgress) onProgress(receivedBytes, totalBytes); });
      response.pipe(file);
      file.on("finish", () => file.close(() => {
        try { fs.renameSync(temp, destination); if (onProgress) onProgress(totalBytes || receivedBytes, totalBytes || receivedBytes); resolve(destination); }
        catch (err) { fs.rmSync(temp, {force:true}); reject(err); }
      }));
      file.on("error", err => { fs.rmSync(temp, {force:true}); reject(err); });
    }).on("error", reject);
  });
}
function appEntry(id) { return path.join(appDir(), id, ...APPS[id].file.split("/")); }
function isInstalled(id) { return fs.existsSync(appEntry(id)) && fs.existsSync(path.join(appDir(), id, "assets", "mossuite-logo.svg")); }

ipcMain.handle("apps:list", () => Object.entries(APPS).map(([id, item]) => {
  const installed = isInstalled(id);
  if (installed && process.platform === "linux") createDesktopEntry(id, item);
  return { id, name:item.name, category:item.category, description:item.description, installed };
}));

ipcMain.handle("apps:install", async (event, id) => {
  const item = APPS[id];
  if (!item) throw new Error("Unknown app");
  const base = path.join(appDir(), id);
  const files = [
    {remote:item.file, destination:appEntry(id), label:item.file},
    ...SHARED_FILES.map(file => ({remote:file, destination:path.join(base, ...file.split("/")), label:file}))
  ];
  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    await download(ROOT + file.remote, file.destination, (received, total) => {
      const fraction = total > 0 ? Math.min(1, received / total) : 0;
      const percent = Math.min(99, Math.floor(((index + fraction) / files.length) * 100));
      event.sender.send("apps:install-progress", {id, percent, file:file.label, current:index + 1, total:files.length});
    });
    event.sender.send("apps:install-progress", {id, percent:Math.floor(((index + 1) / files.length) * 100), file:file.label, current:index + 1, total:files.length});
  }
  if (process.platform === "linux") createDesktopEntry(id, item);
  event.sender.send("apps:install-progress", {id, percent:100, file:"Complete", current:files.length, total:files.length, complete:true});
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
function openInstalledApp(id) {
  const item = APPS[id];
  if (!item || !isInstalled(id)) return false;
  const win = new BrowserWindow({
    width:1200,height:820,minWidth:800,minHeight:600,title:"MosSuite · " + item.name,
    icon:path.join(__dirname,"assets","icon.png"),autoHideMenuBar:true,backgroundColor:"#111214",
    webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true}
  });
  win.webContents.setWindowOpenHandler(({url}) => {
    if (url.startsWith("https://") || url.startsWith("http://")) shell.openExternal(url);
    return {action:"deny"};
  });
  win.loadFile(appEntry(id));
  return true;
}
app.whenReady().then(()=>{
  app.setName("MosSuite");
  const appArg = process.argv.indexOf("--app");
  if (appArg >= 0 && process.argv[appArg + 1]) {
    if (!openInstalledApp(process.argv[appArg + 1])) createWindow();
  } else createWindow();
  app.on("activate",()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
});
app.on("window-all-closed",()=>{if(process.platform!=="darwin")app.quit();});
