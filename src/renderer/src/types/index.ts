export interface Device {
  name: string
  ip: string
  mac: string
  model?: string
  version?: string
  room?: string
  status: string
  isMaster?: boolean
  isSlave?: boolean
  master?: string
  slave?: string
}

export interface DeviceStatus {
  state?: string
  volume?: number
  title1?: string
  title2?: string
  image?: string
  // Add more status fields as needed
}

export interface PlayerControlAction {
  type: 'play' | 'pause' | 'skip' | 'back' | 'volume' | 'upgrade' | 'reboot'
  param?: any
}