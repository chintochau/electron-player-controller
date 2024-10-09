import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useRefresh } from '../context/refreshContext'

const SyncStatus = ({ ip,setDeviceGroupingStatus }) => {
  const [deviceData, setDeviceData] = useState(null)
  const { shouldRefresh } = useRefresh()

  const fetchSyncStatus = async () => {
    const res = await window.api.checkSyncStatus(ip)
    const response = res
    setDeviceGroupingStatus(ip, response)
    setDeviceData(response)
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

  if (!deviceData) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-1 justify-center">
      {deviceData.icon && (
        <img
          src={`http://${ip}:11000${deviceData.icon}`}
          alt={deviceData.name}
          className="h-8 w-8 bg-zinc-800 p-1 rounded-sm mx-1"
        />
      )}
      <p>{deviceData.status === "normal" ? "" : deviceData.status}</p>
      <p>{deviceData.status === 'upgrade' && `: ${deviceData.version}`}</p>
    </div>
  )
}

export default SyncStatus
