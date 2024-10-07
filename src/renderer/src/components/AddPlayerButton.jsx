import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useRefresh } from '../context/refreshContext'

const AddPlayerButton = () => {
  const { shouldRefresh, setShouldRefresh } = useRefresh()
  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          setShouldRefresh(false)
        } else {
          setShouldRefresh(true)
        }
      }}
    >
      <DialogTrigger className="absolute top-4 right-4">Add Player</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect to your player</DialogTitle>
          <DialogDescription>
            <ul className="list-disc list-inside">
              <li>Opoen Wifi Settings </li>
              <li>Look for the WiFi network matching the new Player's Hotspot</li>
              <li>Connect to the new Player through </li>
              <li>
                Click{' '}
                <button
                  className="underline text-blue-500"
                  onClick={
                    // open http://10.1.2.3/wificfg
                    () => {
                      window.open(`http://10.1.2.3/wificfg`, '_blank')
                    }
                  }
                >
                  here
                </button>{' '}
                to setup the WiFi.
              </li>
            </ul>
            <p>(It may take a while to load up the page)</p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AddPlayerButton
