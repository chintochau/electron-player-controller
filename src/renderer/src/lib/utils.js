import { PlayIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { DiscAlbumIcon, ListMusicIcon, MusicIcon } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(...inputs))
}

export const playerControl = async (ip, control, param) => {
  const res = await window.api.playerControl(ip, control, param)
  return res
}


export const runCommandForDevice = async (ip, command, type="GET",body) => {
  const res = await window.api.runCommandForDevice(ip, command, type,body)
  return res
}


export const getIconForType = (type) => {
  if (!type) {
    return null
  }
  switch (type.toLowerCase()) {
    case "album":
      return DiscAlbumIcon
    case "artist":
      return ""
    case "screen":
    case "playlist":
      return ListMusicIcon
    case "song":
      return MusicIcon
    case "deep-link":
      return null
    default:
      return null
  }
}


export const removeFromGroup = (slaveDevice) => {
  ///RemoveSlave?slave=secondaryPlayerIP&port=secondaryPlayerPor
  playerControl(slaveDevice.master, 'removeSlave', slaveDevice.ip)
}

export const buildUrl = (baseURL, params) => {
  const queryParams = Object.keys(params)
    .filter(key => params[key] !== null && params[key] !== undefined)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  return queryParams ? `${baseURL}?${queryParams}` : baseURL;
}