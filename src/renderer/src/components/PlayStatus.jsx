import React, { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import {
  MinusIcon,
  Pause,
  PauseCircleIcon,
  PlayCircleIcon,
  PlusIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Timer
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/slider'
import { Button } from '../../../components/ui/button'
import { useRefresh } from '../context/refreshContext'
import PresetsBar from './PresetsBar'
import { useTable } from '../context/tableContext'
import { runCommandForDevice } from '../lib/utils'

const PlayStatus = ({ ip }) => {
  const [status, setStatus] = useState(null)
  const [shouldScroll, setShouldScroll] = useState(false)
  const [volume, setVolume] = useState(null)

  const { refreshTime, shouldRefresh } = useRefresh()
  const { showPreset, setShowPreset } = useTable()

  const fetchStatus = async () => {
    const res = await window.api.checkStatus(ip)
    const response = res
    console.log(response);
    
    setStatus(response)
    setVolume((prev) => {
      if (prev === null) {
        return response?.volume || 0
      }
      return prev
    })
  }

  const transportControl = async (control, param) => {
    const res = await window.api.playerControl(ip, control, param)
    fetchStatus()
    if (control === 'volume') {
      setVolume(param)
    }
  }

  useEffect(() => {
    fetchStatus()
    // fetch status every 1-2 second randomly
    const interval = setInterval(
      () => {
        if (shouldRefresh) {
          fetchStatus()
        }
      },
      refreshTime * 1000 + 500 + Math.random() * 2000
    )
    return () => clearInterval(interval)
  }, [ip, refreshTime, shouldRefresh])

  useEffect(() => {
    // check status?.title1 is too long, set shouldScroll to true
    if (status?.title1 && status?.title1.length > 20) {
      setShouldScroll(true)
    }
    if (status?.title1 && status?.title2) {
      setShouldScroll(true)
    }

  }, [status?.title1])

  const getImageurl = (imagePath) => {
    // check if image path starts wh http:// or https://, if not, src={"http://" + ip + ":11000" + status?.image}
    if (!imagePath.startsWith('http://') && !imagePath.startsWith('https://')) {
      return 'http://' + ip + ':11000' + imagePath
    }

    return imagePath
  }

  const TransportControlButton = ({ status }) => {
    const MainButton = ({ children }) => {
      return (
        <div className={cn('w-full flex justify-center items-center gap-4')}>
          <Button variant="ghost" onClick={() => transportControl('back')}>
            <SkipBackIcon className="w-4 h-4" />
          </Button>
          {children}
          <Button variant="ghost" onClick={() => transportControl('skip')}>
            <SkipForwardIcon className="w-4 h-4" />
          </Button>
        </div>
      )
    }

    switch (status?.state) {
      case 'nothing':
        return <p>Nothing is queue</p>
      case 'pause':
        return (
          <MainButton>
            <Button variant="ghost" onClick={() => transportControl('play')}>
              <PlayCircleIcon className="w-8 h-8" />
            </Button>
          </MainButton>
        )
      case 'stop':
        return (
          <MainButton>
            <Button variant="ghost" onClick={() => transportControl('play')}>
              <PlayCircleIcon className="w-8 h-8" />
            </Button>
          </MainButton>
        )
      case 'play':
        return (
          <MainButton>
            <Button variant="ghost" onClick={() => transportControl('pause')}>
              <PauseCircleIcon className="w-8 h-8" />
            </Button>
          </MainButton>
        )
      case 'stream':
        return (
          <MainButton>
            <Button variant="ghost" onClick={() => transportControl('pause')}>
              <PauseCircleIcon className="w-8 h-8" />
            </Button>
          </MainButton>
        )
      case 'connecting':
        return (
          <MainButton>
            <Button variant="ghost" onClick={() => transportControl('pause')}>
              <PauseCircleIcon className="w-8 h-8" />
            </Button>
          </MainButton>
        )
      default:
        return <div>{status?.state}</div>
    }
  }

  return (
    <div className='flex flex-col'>
      <div className="flex items-center gap-2 justify-end px-2">
        <div className="flex items-center justify-center w-16 h-16 relative">
          <div className={cn("absolute -bottom-5 left-1 w-full flex items-center justify-start  hover:text-primary cursor-pointer",
            status?.sleep ? 'text-primary/50' : "text-background"
          )} onClick={async () => {
            await runCommandForDevice(ip, ':11000/Sleep')
            fetchStatus()
          }
          } >
            <Timer className="w-4 h-4" />
            <p className='text-xs'>
              {status?.sleep && status?.sleep + " min"}
            </p>
          </div>
          {status?.image && (
            <img
              className="w-full rounded-sm aspect-auto"
              src={getImageurl(status?.image)}
              alt="image"
            />
          )}
        </div>
        <div className="flex flex-col flex-1 items-center">
          <TransportControlButton status={status} />
          {status?.progress !== null && (
            <Progress
              className='h-1  w-44 my-1'
              value={status?.progress}
            />
          )}
          <div className="overflow-hidden whitespace-nowrap w-52 ">
          <div className={cn('flex space-x-12 w-full', shouldScroll ? 'animate-marquee' : '')}>
              <span>{status?.title1} {status?.title2 && " 。 " + status?.title2} {status?.title3 && " 。 " + status?.title3}</span>
              <span className={cn(shouldScroll ? 'inline' : 'hidden')}>
                {status?.title1}{status?.title2 && " 。 " + status?.title2} {status?.title3 && " 。 " + status?.title3}
              </span>
              <span className={cn(shouldScroll ? 'inline' : 'hidden')}>
                {status?.title1}{status?.title2 && " 。 " + status?.title2} {status?.title3 && " 。 " + status?.title3}
              </span>
            </div>
          </div>
          {status?.volume && (
            <div className="flex items-center gap-2">
              <Slider
                value={[volume]}
                max={100}
                onValueChange={(v) => {
                  setVolume(v[0])
                }}
                onValueCommit={(v) => transportControl('volume', v[0])}
                className="w-40"
              />
              <button onClick={() => transportControl('volume', Number(volume) + 5)}>
                <PlusIcon className="h-4 w-4 bg-accent  rounded-full cursor-pointer" />
              </button>
              <button onClick={() => transportControl('volume', Number(volume) - 5)}>
                <MinusIcon className="h-4 w-4 bg-accent rounded-full cursor-pointer" />
              </button>
            </div>
          )}
        </div>
      </div>
      {showPreset && <PresetsBar ip={ip} />}
    </div>
  )
}

export default PlayStatus
