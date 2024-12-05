import React, { useEffect, useState } from 'react'
import { useDevices } from '../../context/devicesContext'
import { useBrowsing } from '../../context/browsingContext'
import { cn } from '../../../../lib/utils'

const SDUINowPlayingMatch = ({ nowPlayingMatch,className }) => {
  const [isNowPlaying, setIsNowPlaying] = useState(false)

  const { devicesStatus, getDeviceStatus } = useDevices()
  const { selectedPlayer } = useBrowsing()
  useEffect(() => {
    const status = getDeviceStatus(selectedPlayer.ip)
    if (status === null || undefined) return
    const { key, value } = nowPlayingMatch?.[0]?.$ || {}
    if (value === status[key]?.[0]) {
      setIsNowPlaying(true)
    } else {
      setIsNowPlaying(false)
    }
    return () => {}
  }, [devicesStatus, selectedPlayer])

  if (!isNowPlaying) return null
  return (
    <div className={cn("size-10 bg-background/65 rounded-md",className)}>
      <NowPlayingIcon />
    </div>
  )
}


const NowPlayingIcon = () => {
    return (
      <div className="flex items-center space-x-1 justify-center h-full">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`h-3 w-1 bg-primary animate-wave`}
            style={{
              animationDelay: `${i * 0.3}s`,
            }}
          ></span>
        ))}
      </div>
    );
  };

export default SDUINowPlayingMatch
