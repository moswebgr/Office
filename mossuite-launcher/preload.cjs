const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("mosSuite", {
  listApps: () => ipcRenderer.invoke("apps:list"),
  installApp: id => ipcRenderer.invoke("apps:install", id),
  openApp: id => ipcRenderer.invoke("apps:open", id)
});
