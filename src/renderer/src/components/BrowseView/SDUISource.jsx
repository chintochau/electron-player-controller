import React from 'react'
import { useBrowsing } from '../../context/browsingContext'
import noArtWork from '../../assets/noartwork.png'
import SDUIButton from './SDUIButton'
const SDUISource = ({ source }) => {
    const { $, button, input } = source || {}
    const { icon, title } = $ || {}
    const { getImagePath } = useBrowsing()
    return (
        <div className='flex flex-col border-1 border-primary/80 rounded-xl  bg-gradient-to-b from-primary/60 to-primary/40 px-4 py-5 gap-2 w-40'>
            <div className='flex items-center gap-2'>
                <div className={`h-6 overflow-hidden  ${title ? 'w-6' : ''}`}>
                    <img 
                    className='object-contain h-6'
                    src={getImagePath(icon) || noArtWork} onError={(e) => e.target.src = noArtWork} />
                </div>
                {title && <h3 className='text-base font-semibold'>
                    {title}
                </h3>}
            </div>
            {button && <div className='flex flex-col gap-1'>
                {
                    button.map((subButton, index) => (
                        <SDUIButton button={subButton} key={index} index={index} className=" h-7 w-full" />
                    ))
                }
            </div>}

        </div>
    )
}

export default SDUISource