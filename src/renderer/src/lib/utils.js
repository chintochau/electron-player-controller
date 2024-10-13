import clsx from 'clsx'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(...inputs))
}

export const playerControl = async (ip, control, param) => {
  const res = await window.api.playerControl(ip, control, param)
}


export const runCommandForDevice = async (ip, command, type) => {
  const res = await window.api.runCommandForDevice(ip, command, type)
}


export const getMusicServiceString = (musicService) => {
  switch (musicService.toLowerCase()) {
    case 'qobuz':
      return 'Qobuz'
    case 'tidal':
      return 'Tidal'
    default:
      return 'TuneIn'
  }
}