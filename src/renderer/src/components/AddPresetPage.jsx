import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import React, { Fragment, useEffect, useState } from 'react'
import { useSdui } from '../context/sduiContext'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useBrowsing } from '../context/browsingContext'
import PresetItem from './BrowseView/PresetItem'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { buildUrl, encodeUrl, runCommandForDevice } from '../lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useDevices } from '../context/devicesContext'
import { usePreset } from '../context/presetContext'

const AddPresetPage = () => {
  const {
    selectedService,
    setSelectedService,
    selectedPreset,
    setSelectedPreset,
    presetNumber,
    setPresetNumber,
    presetName,
    setPresetName
  } = usePreset()
  const { isAddpresetPageShown, setIsAddpresetPageShown } = useSdui()
  const { loadSDUI, selectedPlayer } = useBrowsing()
  const { devices } = useDevices()
  const [serviceList, setServiceList] = useState([])
  const [breadcrumbItems, setBreadcrumbItems] = useState([])
  const [radiotime, setRadiotime] = useState([])
  const [isApplyToAllPlayers, setIsApplyToAllPlayers] = useState(false)

  useEffect(() => {
    const browsePresetServices = async () => {
      const res = await loadSDUI(':11000/RadioBrowse?service=Presets')
      console.log(res.json.radiotime)
      setServiceList(res.json.radiotime)
    }

    if (isAddpresetPageShown) {
      browsePresetServices()
    }

    return () => {}
  }, [isAddpresetPageShown])

  useEffect(() => {
    if (selectedService) {
      const serviceData = serviceList.item?.find((item) =>
        item.$.service ? item.$.service === selectedService : selectedService === item.$.URL
      )
      const { URL, service, type, key } = serviceData?.$ || {}
      const params = { url: URL, service: URL === 'playlists' ? 'Presets' : service, key }
      const getRadioTime = async () => {
        const path = buildUrl(':11000/RadioBrowse', params)
        const res = await loadSDUI(path)
        console.log(res.json.radiotime)
        setRadiotime(res.json.radiotime)
      }
      getRadioTime()
    }
    return () => {}
  }, [selectedService])

  const selectItem = (item, index) => {
    console.log(item)
    const { $ } = item || {}
    const { type } = $ || {}

    if (type && type === 'audio') {
      console.log('audio')
      console.log(item)
      setSelectedPreset(item)
      setPresetName(item.$.text)
      return
    }

    const params = { url: $?.URL, service: selectedService, key: $?.key }

    if (index || (index === 0 && item.$.text)) {
      setBreadcrumbItems([...breadcrumbItems.slice(0, index + 1)])
      performRadioBrowse(params)
      return
    }

    if (item.$.text) {
      setBreadcrumbItems([...breadcrumbItems, item])
      performRadioBrowse(params)
    }
  }

  const performRadioBrowse = async (params) => {
    const path = buildUrl(':11000/RadioBrowse', params)
    const encodedPath = encodeUrl(path)
    const res = await loadSDUI(encodedPath)
    console.log('radiotime', res.json.radiotime)
    setRadiotime(res.json.radiotime)
  }

  const handleSavePreset = async () => {
    console.log(
      selectedPreset
    );
    
    const encoded_url = encodeUrl(selectedPreset.$.URL)
    const path = buildUrl(
      ':11000/SetPreset',
      { id: presetNumber, name: presetName, image: selectedPreset.$.image, encoded_url },
      selectedService === 'Capture'
    )
    if (isApplyToAllPlayers) {
      devices.forEach((device) => {
        runCommandForDevice(device.ip, path)
      })
    } else {
      runCommandForDevice(selectedPlayer.ip, path)
    }
  }

  const resetPreset = () => {
    setSelectedPreset(null)
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
              setSelectedService(e)
              console.log(e);
              
              resetPreset()
              const service = serviceList.item?.find((item) =>
                item.$.service ? item.$.service === e : e === item.$.URL
              )
              setBreadcrumbItems([service])
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a service" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              {serviceList &&
                serviceList.item?.map((item, index) => (
                  <SelectItem key={index} value={item.$.service || item.$.URL}>
                    <PresetItem item={item} selector />
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {!selectedPreset && selectedService && (
            <>
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbItems.map((item, index) => (
                    <Fragment key={'breadcrumb' + index}>
                      <BreadcrumbItem
                        className={cn(
                          index === breadcrumbItems.length - 1
                            ? 'pointer-events-none'
                            : ' cursor-pointer text-muted-foreground/50',
                          ' duration-300 transition-all ease-in-out'
                        )}
                        onClick={() => {
                          selectItem(item, index)
                        }}
                      >
                        <BreadcrumbLink>{item.$.text}</BreadcrumbLink>
                      </BreadcrumbItem>
                      {index !== breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                    </Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>

              <ScrollArea className="w-full h-[50vh]  rounded-md  bg-primary/30 p-2">
                <div className="flex flex-col">
                  {radiotime &&
                    radiotime.item?.map((item, index) => (
                      <PresetItem
                        item={item}
                        key={'item' + index}
                        selectItem={() => selectItem(item)}
                      />
                    ))}
                  {radiotime &&
                    radiotime.category?.map((item, ctindex) => (
                      <Fragment key={'category' + ctindex}>
                        <div className="text-lg font-semibold">{item.$.text}</div>
                        {item.item?.map((subItem, index) => (
                          <PresetItem
                            item={subItem}
                            key={'subItem' + index}
                            selectItem={() => selectItem(subItem)}
                          />
                        ))}
                      </Fragment>
                    ))}
                  {(!radiotime || (radiotime && !radiotime.category && !radiotime.item)) && (
                    <div className="w-full flex items-center justify-center text-lg font-semibold py-20">
                      No items found
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
          {selectedPreset && (
            <div>
              <p>Selected Preset:</p>
              <div className="border rounded-md w-full">
                <PresetItem item={selectedPreset} selectItem={resetPreset} />
              </div>
              <div className="flex items-center  gap-4 pt-2">
                <div className="flex flex-col flex-1">
                  <p>Name:</p>
                  <Input
                    placeholder="Preset Name"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-fit">
                  <p className=" text-nowrap">Preset Slot:</p>
                  <Select value={presetNumber} onValueChange={(e) => setPresetNumber(e)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Slot" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
                        <SelectItem key={index} value={item}>
                          <p>{item}</p>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between items-center">
            <Checkbox
              id="save-to-all"
              onCheckedChange={(e) => setIsApplyToAllPlayers(e)}
              value={isApplyToAllPlayers}
            />
            <Label htmlFor="save-to-all">Save to all devices</Label>
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
