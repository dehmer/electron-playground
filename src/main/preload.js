import { contextBridge, ipcRenderer } from 'electron'

// Accessible in renderer through `window.api`.
//
const api = {
  versions: () => process.versions
}

contextBridge.exposeInMainWorld('api', api)
