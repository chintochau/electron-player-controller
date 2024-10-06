import { AudioWaveformIcon, Drill, Headset, Wifi } from 'lucide-react'

export const commandList = [
  {
    name: '/SyncStatus',
    command: 'SyncStatus'
  },
  {
    name: '/Status',
    command: 'Status'
  },
  {
    name: '/ui/Home',
    command: 'ui/Home?playnum=1'
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
