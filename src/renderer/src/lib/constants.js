import { AudioWaveformIcon, Drill, Headset, Wifi } from 'lucide-react'

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
    name: '/SyncStatus',
    command: ':11000/SyncStatus'
  },
  {
    name: '/Status',
    command: ':11000/Status'
  },
  {
    name: '/ui/Home',
    command: ':11000/ui/Home?playnum=1'
  },
  // {
  //   name:"/Initialize=true",
  //   command:"SetInitialized?init=1"
  // },
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
