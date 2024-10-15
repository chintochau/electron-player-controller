import React, { useState } from 'react'
import { useDevices } from '../context/devicesContext'
import SyncStatus from './SyncStatus'
import PlayStatus from './PlayStatus'
import { useBrowsing } from '../context/browsingContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'


const demoPlayqueue = [
  "Song 1",
  "Song 2",
  "Song 3",
  "Song 4",
  "Song 5",
  "Song 6",
  "Song 7",
  "Song 8",
  "Song 9",
  "Song 10",
  "Song 11",
  "Song 12",
  "Song 13",
  "Song 14",
  "Song 15",
]

const CompactPlayer = ({ ip }) => {
  const { devices } = useDevices()
  const { selectedPlayer, setSelectedPlayer } = useBrowsing()
  const device = devices.find((device) => device.ip === ip)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
    <div
      onClick={() => setSelectedPlayer(device)}
      className={cn("flex flex-col w-68 outline outline-1  outline-accent rounded-md p-2", selectedPlayer.ip === ip ? "bg-primary/20" : "")}>
      <div className="flex items-center">
        <SyncStatus ip={ip} compact={true} />
        <h3>{device.name}</h3>
      </div>
      <div className="flex  w-full">
        <PlayStatus ip={ip} />
      </div>
      <Button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mt-4" variant="outline">
        Queue
      </Button>
      <ScrollArea className={cn("flex w-full duration-300 ease-in flex-col", isMenuOpen ? "w-full h-96 " : "h-0 overflow-hidden")}>
        {
          demoPlayqueue.map((song, index) => (
            <div key={index} className="flex flex-col w-full text-3xl">
              <div className="flex items-center">
                {index + 1}. {song}
              </div>
            </div>
          ))
        }
      </ScrollArea>
    </div>
  )
}

export default CompactPlayer
