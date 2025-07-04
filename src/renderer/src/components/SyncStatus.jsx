import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useRefresh } from '../context/refreshContext'
import { useDevices } from '../context/devicesContext'

const SyncStatus = ({ ip }) => {
  const [deviceSyncStatus, setDeviceSyncStatus] = useState(null)
  const { shouldRefresh } = useRefresh()
  const { devices, setDevices, updateDeviceStatus, setDeviceGroupingStatus } = useDevices()
  const [tempStatus, setTempStatus] = useState(null)

  const fetchSyncStatus = async () => {
    const res = await window.api.checkSyncStatus(ip)
    const response = res
    setDeviceGroupingStatus(ip, response)
    setDeviceSyncStatus(response)
    // when status is not null, find device with the matching ip and set the status to null
    if (response.status !== null) {
      updateDeviceStatus(ip, null)
    }
  }

  useEffect(() => {
    fetchSyncStatus()
    const interval = setInterval(() => {
      if (shouldRefresh) {
        fetchSyncStatus()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [ip, shouldRefresh])

  useEffect(() => {
    if (devices) {
      const matchingDevice = devices.find((device) => device.ip === ip)
      setTempStatus(matchingDevice?.status)
    }
  }, [devices])

  if (!deviceSyncStatus) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-1 justify-center">
      {deviceSyncStatus.icon && (
        <img
          src={`http://${ip}:11000${deviceSyncStatus.icon}`}
          alt={deviceSyncStatus.name}
          className="h-8 w-8 bg-zinc-800 p-1 rounded-sm mx-1"
        />
      )}
      <p>
        {deviceSyncStatus.status === 'normal' ? tempStatus : deviceSyncStatus.status || tempStatus}
      </p>
    </div>
  )
}

export default SyncStatus
