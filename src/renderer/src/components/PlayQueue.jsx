import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import Queue from './BrowseView/Queue'
import { useBrowsing } from '../context/browsingContext'
import { Loader2 } from 'lucide-react'
import { useSdui } from '../context/sduiContext'

const PlayQueue = ({ ip }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [queue, setQueue] = useState(null)
    const { loadSDUI, selectedPlayer } = useBrowsing()

    const isSelectedPlayer = ip === selectedPlayer?.ip

    if (!useBrowsing) {
        return <Loader2 className='animate-spin size-20' />
    }

    const loadQueue = async () => {
        const res = await loadSDUI("/ui/Queue?playnum=1", ip)
        setQueue(res.json.queue)
    }


    useEffect(() => {
        let interval
        if (isMenuOpen) {
            loadQueue()
            interval = setInterval(() => {
            console.log("loading queue");
                loadQueue()
            }, 7000);
        }
        return () => clearInterval(interval)
    }, [isMenuOpen])

    const handleMenuClick = () => {
        if (!isSelectedPlayer) {
            setIsMenuOpen(true)
        } else if (isMenuOpen) {
            setIsMenuOpen(false)
        } else {
            setIsMenuOpen(true)
        }

    }

    return (
        <>
            <Button onClick={handleMenuClick} className="mt-4" variant="outline">
                Queue
            </Button>
            <ScrollArea
                className={cn(
                    'flex w-full duration-300 ease-in flex-col bg-background ',
                    isMenuOpen && isSelectedPlayer ? 'h-[50vh] ' : 'h-0 '
                )}
            >
                <div className='px-2'>{queue ? <Queue queue={queue} /> : <div className='w-full h-[50vh] flex items-center justify-center'><Loader2 className='animate-spin size-16' /></div>}</div>
            </ScrollArea>
        </>
    )
}

export default PlayQueue