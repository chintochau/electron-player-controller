import { AudioWaveformIcon, Bolt, Cog, Drill, Headset, Library, Music, Network, Wifi, Wrench } from 'lucide-react'


export const enabledFeatures = {
  browser: true,
  addPlayer: true,
  darkMode: true,
  urlBar:false,
  xmlMode:false,
}

export const mapCommandByName = (commandName) => {
  const command = commandName.startsWith("API:") ? 
  commandList.find((command) => command.name === commandName.split(":")[1]).command:
  commandName
  return command
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
    name:"Initialize Player",
    command:":11000/SetInitialized?init=1"
  },{
    name:"DeInitialize Player",
    command:":11000/SetInitialized?init=0"
  },{
    name:"Hotspot Mode",
    command:"/apmode?noheader=0"
  },{
    name:"Wac Mode",
    command:"/apmode?wac=1"
  },{
    name:"Diagnostics log",
    command:"/diag?print=1",
    download:true
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
    name:"Customize Sources",
    path:"settings?page_id=capture",
    icon:Cog,
  },
  {
    name:"Music Library",
    path:"settings?page_id=library",
    icon:Library,

  },{
    name:"Configure Music Services",
    path:"services",
    icon:Music,
  },{
    name:"Configure IR Triggers",
    path:"triggercfg",
    icon:Wrench,
  },{
    name:"Configure Active Zones",
    path:"zones",
    icon:Bolt,
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

export const defaultRoomList = [
  "Lobby",
  "Show Room",
  "Unassigned"
]