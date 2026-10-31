const { app, BrowserWindow, shell } = require("electron");
const path = require("path");
const APP_URLS = new Set(["https://moswebgr.github.io/Office/gridforge/","https://moswebgr.github.io/Office/slidespark/","https://moswebgr.github.io/Office/datanest/","https://moswebgr.github.io/Office/mailnest/"]);
function createWindow() {
 const win = new BrowserWindow({width:1100,height:760,minWidth:760,minHeight:560,title:"MosSuite",icon:path.join(__dirname,"assets","icon.png"),backgroundColor:"#10131b",autoHideMenuBar:true,webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true}});
 win.loadFile(path.join(__dirname,"app","index.html"));
 win.webContents.setWindowOpenHandler(({url})=>{if(APP_URLS.has(url)) shell.openExternal(url);return {action:"deny"};});
}
app.whenReady().then(()=>{app.setName("MosSuite");createWindow();app.on("activate",()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});});
app.on("window-all-closed",()=>{if(process.platform!=="darwin")app.quit();});
