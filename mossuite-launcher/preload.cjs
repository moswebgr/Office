const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld("mosSuite", { openApp: (path) => window.open(path, "_blank") });
