import React from 'react'
import { useTable } from '../context/tableContext'

const Footer = () => {
    const { version, setVersion } = useTable()
    return (
        <div
            className='fixed bottom-0 flex h-20 w-full items-center justify-center text-sm text-foreground px-10 bg-background'
        ><div className='w-full border-foreground h-full px-2 bg-background'>Footer</div></div>
    )
}

export default Footer