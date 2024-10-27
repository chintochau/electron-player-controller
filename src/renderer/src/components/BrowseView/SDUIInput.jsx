import React from 'react'
import { useSdui } from '../../context/sduiContext'
import { useBrowsing } from '../../context/browsingContext'
import noArtWork from '../../assets/noartwork.png'

const SDUIInput = ({ input }) => {
    const { $, action, nowPlayingMatch } = input || {}
    const { icon, title } = $ || {}
    const { performAction } = useSdui()
    const { getImagePath } = useBrowsing()
    return (
        <div
            className='shadow-md size-auto xl:size-40 flex flex-col items-center justify-center bg-primary/10 border border-primary/5 rounded-lg px-3 lg:px-6 lg:py-4 py-2 hover:bg-primary/20 cursor-pointer'
            onClick={() => performAction(action)}
        >
            <div className='size-12 xl:size-16'>
                <img src={getImagePath(icon) || noArtWork} onError={(e) => e.target.src = noArtWork} />
            </div>
            <h3 className='text-sm'>{title}</h3>
        </div>
    )
}

export default SDUIInput