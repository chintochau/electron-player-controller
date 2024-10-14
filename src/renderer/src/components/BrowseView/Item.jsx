import React from 'react'
import { useBrowsing } from '../../context/borwsingContext'
import { cn } from '@/lib/utils'

const Item = ({ item, large }) => {
    // size = 'small' | 'large' 
    const { $ } = item
    const { image, quality, subTitle, title, duration } = $
    const { getImagePath } = useBrowsing()
    return (
        <div className={cn('flex lg:rounded-md gap-2 w-ful xl:flex-col')}>

            {image && <div className={
                cn(
                    'w-full rounded-md overflow-hidden object-cover flex-shrink-0 xl:flex-1 items-center justify-center flex',
                    large ?
                        'w-14 h-14 lg:w-20 lg:h-20 xl:w-full xl:h-full' :
                        "")}>
                <img className='transition-all hover:scale-105 w-full h-full object-cover ' src={image && getImagePath(image)} />
            </div>}

            <div className="space-y-1 text-sm pt-1 min-w-20 w-[calc(100%-3.5rem)] xl:w-full">

                <div className={cn(image ? "" : "underline hover:text-primary cursor-pointer")}>
                    <h3 className={cn("font-medium leading-none text-wrap", image ?"":"text-xl")}>{title}</h3>
                    <p className="text-xs text-muted-foreground w-60 text-wrap">
                        {subTitle}
                    </p>
                </div>

                <p
                    className="text-xs text-muted-foreground w-60 text-wrap">
                    {duration}
                </p>

            </div>
        </div>
    )
}

export default Item