import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React from 'react'
import { useSdui } from '../context/sduiContext'

const AddPresetPage = () => {
    const {isAddpresetPageShown} = useSdui()
    return (
        <Dialog open={isAddpresetPageShown}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Preset</DialogTitle>
                    <DialogDescription>
                        add preset
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default AddPresetPage