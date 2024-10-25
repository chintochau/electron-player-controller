import { AudioWaveformIcon, Drill, Headset, Network, Wifi } from 'lucide-react'


export const enabledFeatures = {
  browser: true,
  addPlayer: true,
  darkMode: true
}

export const commandList = [
  {
    name: "Disable Upgrade Popup",
    command: "/enable?no_upgrade=yes"
  },
  {
    name: "Enable Upgrade Popup",
    command: "/enable?no_upgrade=no"
  },
  {
    name:"Initialize=true",
    command:":11000/SetInitialized?init=1"
  },{
    name:"Initialize=false",
    command:":11000/SetInitialized?init=0"
  },{
    name:"Hotspot Mode",
    command:"/apmode?noheader=0"
  },{
    name:"Wac Mode",
    command:"/apmode?wac=1"
  }
]

export const settingsList = [
  {
    name: 'Audio Settings',
    path: 'settings?page_id=audio',
    icon: AudioWaveformIcon
  },
  {
    name: 'Wifi Settings',
    path: 'wificfg',
    icon: Wifi
  },
  {
    name: "Static IP",
    path: "staticip",
    icon: Network
  },
  {
    name: 'Diagnostics',
    path: 'diagnostics',
    icon: Drill
  }
]

export const helpList = [
  {
    name: 'Support Request',
    path: 'diag',
    icon: Headset
  }
]


export const searchableServicesList = [
  "Qobuz",
  "Tidal",
]