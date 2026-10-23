const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("kinotix", {
  version: "1.0.0",
});