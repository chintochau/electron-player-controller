import { Button } from '@/components/ui/button'
import React from 'react'
import { useSdui } from '../../context/sduiContext'

const SDUIButton = ({ button, index, className }) => {
    const { $, action } = button || {}
    const { text, backgroundColor, textColor, icon } = $
    const { performAction } = useSdui()
    return (
        <Button
            variant={index % 2 !== 0 ? "outline" : ""}
            size="lg"
            className={className}
            onClick={() => performAction(action)} >
            {text}
        </Button>
    )
}

export default SDUIButton