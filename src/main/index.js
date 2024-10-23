import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import bonjour from 'bonjour'
import xml2js from 'xml2js'
import { checkUpgrade, connectToDeviceThroughWifi, getCurrentWifi, getWifiList, loadSDUIPage } from './functions'

let masterWindow
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    show: false,
    autoHideMenuBar: true,
    focusable: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    focusable: true
  })

  masterWindow = mainWindow

  mainWindow.on('ready-to-show', () => {
    mainWindow.showInactive()
    // mainWindow.webContents.openDevTools()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Handle discovery in the main process
ipcMain.handle('discover-devices', async () => {
  const bonjourService = bonjour()
  const discoveredDevices = []

  // Function to add a service when discovered
  const addService = (service) => {
    // Ignore duplicate service by IP
    if (!discoveredDevices.some((s) => s.referer.address === service.referer.address)) {
      discoveredDevices.push(service)
    }
  }

  // Return a Promise that resolves after some time or when discovery is complete
  return new Promise((resolve) => {
    // Find services of type 'musc.tcp'
    bonjourService.find({ type: 'musc', protocol: 'tcp' }, addService)

    // Stop discovery after a timeout (e.g., 5 seconds)
    setTimeout(() => {
      bonjourService.destroy(); // Stop Bonjour service to prevent memory leaks
      resolve(discoveredDevices) // Resolve with the discovered devices
    }, 1000) // Adjust the timeout as needed
  })
})

ipcMain.handle('check-status', async (event, ip) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // Set timeout to 10 seconds

  try {
    const res = await fetch(`http://${ip}:11000/Status`, {
      signal: controller.signal
    })

    clearTimeout(timeoutId) // Clear the timeout when fetch succeeds

    const xmlText = await res.text()
    const xml = await xml2js.parseStringPromise(xmlText)

    // check if the xml and xml.status is valid and if it has status, if not, return unknown

    const statusXml = xml?.status ?? 'unknown'

    if (statusXml === 'unknown') {
      return { success: false, state: 'unknown' }
    }

    let response

    if (
      statusXml &&
      statusXml.service &&
      statusXml.state &&
      statusXml.volume &&
      statusXml.title1 &&
      statusXml.image
    ) {
      let progress

      if (statusXml.secs && statusXml.totlen) {
        progress = (100 * statusXml.secs[0]) / statusXml.totlen[0]
      }

      response = {
        success: true,
        service: statusXml.service[0],
        state: statusXml.state[0],
        volume: statusXml.volume[0],
        title1: statusXml.title1[0],
        image: statusXml.image[0],
        progress: progress
      }
    } else {
      return { success: false, state: 'nothing' }
    }

    return response
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Fetch request timed out')
      return { success: false, state: 'timeout' }
    } else {
      console.log('error', error)
      return { success: false, state: 'Unknown' }
    }
  }
})

ipcMain.handle('check-sync-status', async (event, ip) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // Set timeout to 10 seconds

  try {
    const res = await fetch(`http://${ip}:11000/SyncStatus`, { signal: controller.signal })
    clearTimeout(timeoutId) // Clear the timeout when fetch succeeds

    const xmlText = await res.text()
    const xml = await xml2js.parseStringPromise(xmlText)

    const { SyncStatus, UpgradeStatusStage1, UpgradeStatusStage2, UpgradeStatusStage3 } = xml

    let response

    if (SyncStatus) {
      const { $, master, slave } = SyncStatus
      let masterIp, slaveList
      if (master) {
        masterIp = master[0]._
      }
      response = {
        success: true,
        status: $.initialized === 'true' ? 'normal' : 'Need Setup',
        icon: $.icon,
        schemaVersion: $.schemaVersion,
        volume: $.volume,
        isMaster: slave ? true : false,
        master: masterIp,
        isSlave: master ? true : false,
        slave
      }
    }



    if (UpgradeStatusStage1 || UpgradeStatusStage2 || UpgradeStatusStage3) {
      const upgrade = UpgradeStatusStage1 || UpgradeStatusStage2 || UpgradeStatusStage3

      console.log('upgrade', upgrade);
      
      const {step,total,percent,git} = upgrade

      response = {
        success: true,
        status: `Upgrading: ${git[0]} - ${step[0]}/${total[0]} ${percent ? [0] && `(${percent[0]}%)` : ''}`,
      }
    }

    return response || { success: false, status: 'no_status' } // Default response if no status is found
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Fetch request timed out')
      return { success: false, status: null }
    } else {
      console.log('Error:', error)
      return { success: false, status: null }
    }
  }
})

ipcMain.handle('player-control', async (event, { ip, control, param }) => {
  let res

  switch (control) {
    case 'volume':
      console.log('volume', param)
      res = await fetch(`http://${ip}:11000/Volume?level=${param}&tell_slaves=0`)
      break
    case 'reboot':
      console.log('rebooting')
      res = await fetch(`http://${ip}/reboot?yes=1`, { method: 'POST' })
      break
    case 'factoryreset':
      console.log('factoryreset')
      res = await fetch(`http://${ip}/factoryreset`)
      break
    case 'play':
      console.log('play')
      if (param) {
        res = await fetch(`http://${ip}:11000/Play?seek=${param}`)
      } else {
        res = await fetch(`http://${ip}:11000/Play`)
      }
      break
    case 'pause':
      console.log('pause')
      res = await fetch(`http://${ip}:11000/Pause`)
      break
    case 'skip':
      console.log('skip')
      res = await fetch(`http://${ip}:11000/Skip`)
      break
    case 'back':
      console.log('back')
      res = await fetch(`http://${ip}:11000/Back`)
      break
    case 'upgrade':
      console.log('upgrade', ip, param)
      res = await fetch(`http://${ip}:11000/upgrade?upgrade=this&version=${param}`)
      break
    case "removeSlave":
      console.log('removeSlave')
      res = await fetch(`http://${ip}:11000/RemoveSlave?slave=${param}&port=11000`)
      break
    case "addSlave":
      console.log('addSlave')
      res = await fetch(`http://${ip}:11000/AddSlave?slaves=${param}&ports=11000`)
      break
    default:
      console.log('unknown control')
      return { success: false }
  }

  if (!res || !res.ok) {
    console.log('Error response:', res)
    return { success: false }
  }

  console.log('Control command successful:', control)
  return { success: true } // Return success response
})


ipcMain.handle('run-command-for-device', async (event, { ip, command, type = "GET" }) => {
  // send fetch request to device
  console.log('run-command-for-device', ip, command, type);

  const res = await fetch(`http://${ip}${command}`, { method: type })
  if (!res || !res.ok) {
    console.log(`Failed Command: ${command}`)
    return { success: false }
  }
  console.log('Control command successful:', command)
  return { success: true }
})


ipcMain.handle('open-overlay', (event, url) => {
  let overlayWindow = new BrowserWindow({
    width: 866,
    height: 600,
    frame: true, // No frame to look like an overlay
    transparent: true, // Transparent background
    alwaysOnTop: true, // Always on top to mimic an overlay
    modal: true, // Makes the window modal
    parent: masterWindow, // Optional: Make it a child of the main window
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  overlayWindow.loadURL(url)

  // Handle window close on external click
  overlayWindow.on('blur', () => {
    overlayWindow.close()
  })

  overlayWindow.on('closed', () => {
    overlayWindow = null
  })
})

ipcMain.handle('check-upgrade', async (event, ip) => {
  return await checkUpgrade(ip)
})

ipcMain.handle("get-current-wifi", async () => {
  return await getCurrentWifi();
});

ipcMain.handle("get-wifi-list", async () => {
  return await getWifiList();
});

ipcMain.handle("load-sd-ui-page", async (event, { url, debug }) => {
  return await loadSDUIPage(url, debug);
});

ipcMain.handle("connect-to-wifi", async (event, { ssid }) => {
  console.log('connect-to-wifi', ssid);
  return await connectToDeviceThroughWifi(ssid)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
