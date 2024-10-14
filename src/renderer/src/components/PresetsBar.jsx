import React, { useEffect, useState } from 'react'
import { useBrowsing } from '../context/borwsingContext'
import { useSdui } from '../context/sduiContext'
import { playerControl, runCommandForDevice } from '../lib/utils'

const PresetsBar = ({ ip }) => {
    const { loadSDUI,getImagePath } = useBrowsing()
    const [presets, setPresets] = useState([])

    const loadPresets = async () => {
        const res = await loadSDUI(`:11000/Presets`, ip)
        setPresets(res.json?.presets?.preset || [])
    }

    useEffect(() => {
        loadPresets()
    }, [])


    if (presets.length === 0) return null

    return (
        <div className='flex justify-end border-t mt-3 pt-2 '>
            <div className='flex rounded-md '>
                {presets.slice(0, 5).map((preset) => (
                    <div
                        key={preset.$.id}
                        className='flex flex-col items-start gap-2 cursor-pointer hover:bg-accent hover:text-primary transition-colors rounded-md px-1.5 py-1'
                        onClick={() => {
                            runCommandForDevice(ip, `:11000/Preset?id=${preset.$.id}`, 'GET')
                        }}
                    >
                        <div className='size-12 flex items-center justify-center'>
                            <img
                                className='rounded-md '
                                alt={preset.$.name}
                                src={getImagePath(preset.$.image)} />
                        </div>
                    </div>))}
            </div>
        </div>
    )
}

export default PresetsBar