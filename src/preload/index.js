import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  discoverDevices: () => ipcRenderer.invoke('discover-devices'),
  checkStatus: (ip) => ipcRenderer.invoke('check-status', ip),
  checkSyncStatus: (ip) => ipcRenderer.invoke('check-sync-status', ip),
  playerControl: (ip, control, param) => ipcRenderer.invoke('player-control', {ip, control, param}),
  openOverlay: (url) => ipcRenderer.invoke('open-overlay', url),
  checkUpgrade:(ip) => ipcRenderer.invoke('check-upgrade', ip),
  getCurrentWifi: () => ipcRenderer.invoke('get-current-wifi'),
  getWifiList: () => ipcRenderer.invoke('get-wifi-list'),
  runCommandForDevice: (ip, command, type) => ipcRenderer.invoke('run-command-for-device', {ip, command, type}),
  loadSDUIPage: (url,debug) => ipcRenderer.invoke('load-sd-ui-page', {url, debug}),


}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
