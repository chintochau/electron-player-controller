import clsx from 'clsx'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(...inputs))
}

export const playerControl = async (ip, control, param) => {
  const res = await window.api.playerControl(ip, control, param)
}
