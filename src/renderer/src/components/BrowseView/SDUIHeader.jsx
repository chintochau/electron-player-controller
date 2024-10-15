import { cn } from '@/lib/utils'
import React from 'react'
import { useBrowsing } from '../../context/borwsingContext'
import { Button } from '@/components/ui/button'
import SDUIButton from './SDUIButton'

const SDUIHeader = ({ header, onlyOneListWithHeader }) => {
    const { $, button, description, viewAll } = header || {}
    const { image, title, subTitle, subSubTitle } = $ || {}

    const { getImagePath } = useBrowsing()


    return (
        <div className={cn(
            onlyOneListWithHeader ? "fixed w-[calc(50vw-275px)] flex flex-col items-center p-10 gap-y-3 pt-14" : "",
        )}
        >
            {image && <div className='absolute -z-20 translate-y-[-30%] inset-5 bg-black opacity-20 filter blur-3xl scale-120' style={{ backgroundImage: `url(${getImagePath(image)})` }} />}

            {image &&
                <div className={
                    cn("z-20",
                        onlyOneListWithHeader ?
                            "w-2/3 h-2/3 min-w-28 min-h-28 rounded-lg overflow-hidden bg-blue-50" :
                            ' w-20 h-20 rounded-md overflow-hidden object-cover flex-shrink-0 xl:flex-1 items-center justify-center flex  lg:w-20 lg:h-20 xl:w-full xl:h-full'
                    )}>
                    <img className='transition-all hover:scale-105 w-full h-full object-cover aspect-square ' src={image && getImagePath(image)} />
                </div>}
            <h3 className='text-sm lg:text-lg xl:text-2xl font-bold'>
                {title}
            </h3>
            <p>
                {subTitle}
            </p>
            <p>
                {subSubTitle}
            </p>
            <div className='flex flex-col xl:flex-row gap-2'>
                {button && button.map((item, index) => (
                    <SDUIButton button={item} key={index} index={index} />
                ))}
            </div>
        </div>
    )
}

export default SDUIHeader