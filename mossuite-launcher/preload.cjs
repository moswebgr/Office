const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("mosSuite", {
  listApps: () => ipcRenderer.invoke("apps:list"),
  installApp: id => ipcRenderer.invoke("apps:install", id),
  onInstallProgress: callback => {
    const listener = (_event, progress) => callback(progress);
    ipcRenderer.on("apps:install-progress", listener);
    return () => ipcRenderer.removeListener("apps:install-progress", listener);
  },
  openApp: id => ipcRenderer.invoke("apps:open", id)
});
