import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { Fragment, useEffect, useState } from 'react'
import { useSdui } from '../context/sduiContext'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select'
import { useBrowsing } from '../context/browsingContext'
import PresetItem from './BrowseView/PresetItem'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { buildUrl } from '../lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'


const AddPresetPage = () => {
    const { isAddpresetPageShown, setIsAddpresetPageShown } = useSdui()
    const { loadSDUI } = useBrowsing()
    const [serviceList, setServiceList] = useState([])
    const [breadcrumbItems, setBreadcrumbItems] = useState([])
    const [radiotime, setRadiotime] = useState([])
    const [selectedService, setSelectedService] = useState(null)

    useEffect(() => {
        const browsePresetServices = async () => {
            const res = await loadSDUI(":11000/RadioBrowse?service=Presets")
            console.log(res.json.radiotime)

            setServiceList(res.json.radiotime)
        }

        if (isAddpresetPageShown) {
            browsePresetServices()
        }

        return () => {
        }
    }, [isAddpresetPageShown])

    useEffect(() => {
        if (selectedService) {
            const serviceData = serviceList.item?.find(item => item.$.service ? item.$.service === selectedService : selectedService === item.$.URL)
            const { URL, service, type, key } = serviceData?.$ || {}
            const params = { url: URL, service: URL === "playlists" ? "Presets" : service, key }
            const getRadioTime = async () => {
                const path = buildUrl(":11000/RadioBrowse", params)
                const res = await loadSDUI(path)
                console.log(res.json.radiotime);
                setRadiotime(res.json.radiotime)
            }
            getRadioTime()
        }
        return () => {
        }
    }, [selectedService])

    const selectItem = (item) => {
        console.log(item);
        const { $ } = item || {}
        const { type } = $ || {}


        if (type && type === 'audio') {
            console.log('audio');
            return
        }

        const params = { url: $?.URL, service: selectedService, key: $?.key }
        if (item.$.text) {
            setBreadcrumbItems([...breadcrumbItems, item.$.text])
            performRadioBrowse(params)
        }
    }

    const performRadioBrowse = async (params) => {
        console.log(params);

        const path = buildUrl(":11000/RadioBrowse", params)
        const res = await loadSDUI(path)
        console.log(res.json.radiotime);
        setRadiotime(res.json.radiotime)
    }

    const handleSavePreset = async () => {
        console.log('handleSavePreset');
    }

    return (
        <>
            <Dialog open={isAddpresetPageShown} onOpenChange={setIsAddpresetPageShown}>
                <DialogContent className="w-full max-w-xl xl:max-w-4xl">

                    <DialogHeader>
                        <DialogTitle>Add Preset</DialogTitle>
                    </DialogHeader>

                    <Select
                        onValueChange={(e) => {
                            console.log(e);
                            setSelectedService(e)
                            setBreadcrumbItems([e])
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a preset" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                serviceList && serviceList.item?.map((item, index) => (
                                    <SelectItem key={index} value={item.$.service || item.$.URL}>
                                        <PresetItem item={item} selector />
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>

                    <Breadcrumb>
                        <BreadcrumbList>
                            {
                                breadcrumbItems.map((item, index) => (
                                    <Fragment key={"breadcrumb" + index}>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink>{item}</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        {
                                            index !== breadcrumbItems.length - 1 && <BreadcrumbSeparator />
                                        }
                                    </Fragment>
                                ))
                            }
                        </BreadcrumbList>
                    </Breadcrumb>

                    <ScrollArea className="w-full h-[50vh]  rounded-md bg-primary/10 p-2">
                        <div>
                            {
                                radiotime && radiotime.item?.map((item, index) => (
                                    <PresetItem item={item} key={"item" + index} selectItem={() => selectItem(item)} />
                                ))
                            }
                            {
                                radiotime && radiotime.category?.map((item, ctindex) => (
                                    <Fragment key={"category" + ctindex}>
                                        <div className="text-lg font-semibold">{item.$.text}</div>
                                        {
                                            item.item?.map((subItem, index) => (
                                                <PresetItem item={subItem} key={"subItem" + index} selectItem={() => selectItem(subItem)} />
                                            ))
                                        }
                                    </Fragment>))
                            }
                        </div>
                    </ScrollArea>
                    <DialogFooter className="flex justify-between items-center">
                        <Checkbox/>
                        <p>
                            Apply to all devices
                        </p>
                        <DialogClose asChild>
                            <Button onClick={handleSavePreset}>Save</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddPresetPage