import { app, shell, BrowserWindow, ipcMain, dialog, Tray, screen, Menu } from 'electron'
import { join, resolve } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import trayIcon from "../../resources/icon16.png?asset"
import bonjour from 'bonjour'
import xml2js from 'xml2js'
import { checkUpgrade, connectToDeviceThroughWifi, getCurrentWifi, getWifiList, loadSDUIPage } from './functions'
import fs from 'fs'
const { autoUpdater } = require('electron-updater');

autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info'; // Log to file
autoUpdater.logger.transports.console.level = 'info'; // Log to console

// Set autoDownload to false
autoUpdater.autoDownload = false;

let masterWindow
let masterTrayWindow
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
      sandbox: false,
    },
    focusable: true,
  });

  masterWindow = mainWindow;

  mainWindow.on('ready-to-show', () => {
    mainWindow.showInactive();
  });

  mainWindow.on('closed', () => {
    masterWindow = null; // Clear the reference
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // Load the app
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Focus the existing window
    if (masterWindow) {
      if (masterWindow.isMinimized()) masterWindow.restore();
      masterWindow.focus();
    }

    // if masterWindow is closed, create a new one
    if (!masterWindow) {
      createWindow();
    }
  });

  app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    createWindow()
    createTray()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}
const createTray = () => {
  const tray = new Tray(trayIcon)

  const trayWindow = new BrowserWindow({
    width: 400,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    resizable: true,
    maximizable: false,
    minimizable: false,
    transparent: true,
    frame: false, // Disable the close, min, max buttons
    skipTaskbar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    focusable: true
  })

  // Create the context menu
  const createTrayContextMenu = () => {
    return Menu.buildFromTemplate([
      {
        label: 'Open App',
        click: () => {
          if (!masterWindow) {
            createWindow();
          } else if (!masterWindow.isVisible()) {
            masterWindow.show();
          }
        },
      },
      {
        label: 'Quit',
        click: () => {
          app.quit(); // Quit the application
        },
      },
    ]);
  };


  masterTrayWindow = trayWindow

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    trayWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/trayIndex.html`)
  } else {
    trayWindow.loadFile(join(__dirname, '../renderer/trayIndex.html'))
  }


  tray.on('click', () => {
    toggleWindow()
  })


  tray.on('right-click', () => {
    const contextMenu = createTrayContextMenu();
    tray.popUpContextMenu(contextMenu);
  })


  trayWindow.on('blur', () => {
    // Hide the window when it loses focus
    trayWindow.hide()
  })

  const toggleWindow = () => {
    if (trayWindow.isVisible()) {
      trayWindow.hide()
    } else {
      showWindow()
    }
  }

  ipcMain.handle('display-main-window', () => {
    openMainWindow()
    trayWindow.hide();
  });

  const openMainWindow = () => {
    if (!masterWindow) {
      createWindow(); // Create a new window if none exists
    } else if (!masterWindow.isVisible()) {
      masterWindow.show(); // Show the existing window if it's not visible
    }
  };


  const getWindowPosition = () => {
    const windowBounds = trayWindow.getBounds();
    const trayBounds = tray.getBounds();

    // Get the display containing the tray
    const display = screen.getDisplayMatching(trayBounds);
    const displayBounds = display.workArea;

    let x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
    let y = Math.round(trayBounds.y + trayBounds.height + 4);

    // Ensure the window doesn't go outside the screen horizontally
    if (x < displayBounds.x) x = displayBounds.x;
    if (x + windowBounds.width > displayBounds.x + displayBounds.width) {
      x = displayBounds.x + displayBounds.width - windowBounds.width;
    }

    // Ensure the window doesn't go outside the screen vertically
    if (y < displayBounds.y) y = displayBounds.y;
    if (y + windowBounds.height > displayBounds.y + displayBounds.height) {
      y = displayBounds.y + displayBounds.height - windowBounds.height;
    }

    return { x, y };
  };

  const showWindow = () => {
    const position = getWindowPosition();
    trayWindow.setPosition(position.x, position.y, false);
    trayWindow.show();
  };



}

// This method will be called when Electron has finished


// Handle discovery in the main process
ipcMain.handle('discover-devices', async (event, timeOutInSeconds = 3) => {

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
  return new Promise((resolve, reject) => {
    // Find services of type 'musc.tcp'
    bonjourService.find({ type: 'musc', protocol: 'tcp' }, addService)
      .on('error', (error) => {
        console.error('Bonjour discovery error:', error)
        reject(error)
      })

    // Stop discovery after a timeout (e.g., 5 seconds)
    setTimeout(() => {
      bonjourService.destroy(); // Stop Bonjour service to prevent memory leaks
      resolve(discoveredDevices) // Resolve with the discovered devices
    }, timeOutInSeconds * 1000) // Adjust the timeout as needed
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

    const { sleep, service, state, volume, title1, title2, title3, image } = statusXml || {}    
    if (
      statusXml && service && state && volume && title1 && image
    ) {
      let progress

      if (statusXml.secs && statusXml.totlen) {
        progress = (100 * statusXml.secs[0]) / statusXml.totlen[0]
      }

      response = {
        ...statusXml,
        success: true,
        service: statusXml.service[0],
        state: statusXml.state[0],
        volume: statusXml.volume[0],
        title1: statusXml.title1[0],
        title2: title2?.[0],
        title3: title3?.[0],
        image: statusXml.image[0],
        progress: progress,
        sleep: sleep?.[0] || false,
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
      const { $, master, slave } = SyncStatus || {}
      const { mac } = $ || {}
      const macAddress = mac ? mac.replace(':', '') : null
      let masterIp, slaveList
      if (master) {
        masterIp = master[0]._
      }
      response = {
        success: true,
        status: $.initialized === 'true' ? 'normal' : 'Need Setup',
        mac: macAddress,
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

      const { step, total, percent, git } = upgrade

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

  try {
    if (!res || !res.ok) {
      console.log('Error response:', res)
      return { success: false }
    }
  } catch (error) {
    console.log('Error in player control:', error)
    return { success: false }
  }

  console.log('Control command successful:', control)
  return { success: true } // Return success response
})


ipcMain.handle('run-command-for-device', async (event, { ip, command, type = "GET", body = null }) => {
  console.log('run-command-for-device', ip, command, type, body);

  const options = { method: type };
  if (body && type.toUpperCase() === "POST") {
    options.body = JSON.stringify(body);
    options.headers = { 'Content-Type': 'application/json' };
  }

  const res = await fetch(`http://${ip}${command}`, options);
  if (!res || !res.ok) {
    console.log(`Failed Command: ${command}`);
    return { success: false };
  }
  console.log('Control command successful:', command);
  const data = await res.text();
  return { success: true, data };
});

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

ipcMain.handle("load-sd-ui-page", async (event, { url, debug,schema }) => {
  return await loadSDUIPage(url, debug,schema);
});

ipcMain.handle("connect-to-wifi", async (event, { ssid, password }) => {
  console.log('connect-to-wifi', ssid);
  return await connectToDeviceThroughWifi(ssid, password)
})

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('save-file', async (event, data) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Save File As',
    defaultPath: 'downloaded_file.txt',  // Default filename
    filters: [{ name: 'Text Files', extensions: ['txt'] }]
  });

  if (canceled || !filePath) return; // User canceled the dialog

  fs.writeFileSync(filePath, data, 'utf-8'); // Write the file content to the selected path

  return filePath; // Send the path back to the front end, if needed
});


ipcMain.handle("check-for-app-update", async (event) => {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment) {
      console.log('Update check skipped in development mode');
      return null;
    }
    // Check for updates without notifying the user
    const updateInfo = await autoUpdater.checkForUpdates();
    if (updateInfo.updateInfo.version !== app.getVersion()) {
      return {
        message: "v" + updateInfo.updateInfo.version + " is available.",
        releaseNotes: updateInfo.updateInfo?.releaseNotes || "No release notes available."
      };
    } else {
      // No update is available
      return null;
    }
  } catch (error) {
    console.error('Update error:', error);
    throw new Error('Failed to initiate update: ' + error.message);
  }
})

// Handle app update trigger
ipcMain.handle('perform-app-update', async (event) => {
  try {
    // Check for updates without notifying the user
    const updateInfo = await autoUpdater.checkForUpdates();
    if (updateInfo.updateInfo.version !== app.getVersion()) {
      // An update is available
      autoUpdater.downloadUpdate(); // Start downloading the update
      return "Update available. Downloading...";
    } else {
      // No update is available
      return "No update available.";
    }
  } catch (error) {
    console.error('Update error:', error);
    throw new Error('Failed to initiate update: ' + error.message);
  }
});

// Ensure your autoUpdater is set up properly to handle events
autoUpdater.on('update-downloaded', (info) => {
  // You can prompt the user or automatically quit and install here
  autoUpdater.quitAndInstall();
});

// handle any uncaughtException
// process.on('uncaughtException', (err) => {
//   console.error('Uncaught exception:', err)
// })


app.on('browser-window-blur', (event, window) => {
  // Ensure only the tray window is affected
  if (window === masterTrayWindow) {
    masterTrayWindow.hide()
  }
})
