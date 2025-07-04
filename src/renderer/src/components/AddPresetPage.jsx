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
import { useToast } from '../../../hooks/use-toast'

const AddPresetPage = () => {
  const { toast } = useToast()
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
  const [isApplying, setIsApplying] = useState(false)

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
    console.log(selectedPreset)

    setIsApplying(true)

    try {
      const encoded_url = encodeUrl(selectedPreset.$.URL)
      const path = buildUrl(
        ':11000/SetPreset',
        { id: presetNumber, name: presetName, image: selectedPreset.$.image, encoded_url },
        selectedService === 'Capture'
      )

      if (isApplyToAllPlayers) {
        // Validate and apply preset to all compatible devices
        const results = await validateAndApplyPresetToAll(path)

        // Show results to user
        const successCount = results.filter((r) => r.success).length
        const failureCount = results.filter((r) => !r.success).length

        if (failureCount > 0) {
          // Show detailed results with successes and failures
          const failedDevicesInfo = results
            .filter((r) => !r.success)
            .map((r) => `${r.device} (${r.reason})`)
            .join('; ')

          toast({
            title: 'Preset Applied with Some Failures',
            description: `Successfully applied to ${successCount} device(s). Failed on ${failureCount} device(s): ${failedDevicesInfo}`,
            variant: 'warning'
          })
        } else if (successCount > 0) {
          toast({
            title: 'Preset Applied Successfully',
            description: `Preset applied to all ${successCount} device(s).`,
            variant: 'success'
          })
        } else {
          toast({
            title: 'Preset Application Failed',
            description: 'Could not apply preset to any devices.',
            variant: 'destructive'
          })
        }
      } else {
        await runCommandForDevice(selectedPlayer.ip, path)
        toast({
          title: 'Preset Saved',
          description: `Preset saved to ${selectedPlayer.name}.`,
          variant: 'success'
        })
      }

      // Close the dialog after successful save
      setIsAddpresetPageShown(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save preset. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsApplying(false)
    }
  }

  const validateAndApplyPresetToAll = async (setPresetPath) => {
    const results = []

    // Process devices in parallel for better performance
    const promises = devices.map(async (device) => {
      try {
        // First, check if this device supports the selected service
        const isCompatible = await checkDevicePresetCompatibility(device, selectedService)

        if (isCompatible) {
          // Apply the preset if compatible
          await runCommandForDevice(device.ip, setPresetPath)
          results.push({ device: device.name, success: true })
        } else {
          let reason = `does not support ${selectedService} service`
          if (selectedService === 'Capture' && selectedPreset?.$.inputType) {
            const inputTypeName =
              selectedPreset.$.inputType === 'analog'
                ? 'analog input'
                : selectedPreset.$.inputType === 'spdif'
                  ? 'optical input'
                  : selectedPreset.$.inputType === 'arc'
                    ? 'HDMI ARC'
                    : selectedPreset.$.inputType === 'phono'
                      ? 'phono input'
                      : selectedPreset.$.inputType === 'bluetooth'
                        ? 'Bluetooth'
                        : selectedPreset.$.inputType
            reason = `does not have ${inputTypeName} available`
          }
          results.push({
            device: device.name,
            success: false,
            reason
          })
        }
      } catch (error) {
        results.push({
          device: device.name,
          success: false,
          reason: error.message
        })
      }
    })

    await Promise.all(promises)
    return results
  }

  const checkDevicePresetCompatibility = async (device, service) => {
    try {
      // Query the device for its available preset services using loadSDUI
      const response = await window.api.loadSDUIPage(
        `http://${device.ip}:11000/RadioBrowse?service=Presets`
      )

      if (
        !response ||
        !response.json ||
        !response.json.radiotime ||
        !response.json.radiotime.item
      ) {
        console.warn(`Device ${device.name} returned invalid preset service response`)
        return false
      }

      // Check if the selected service exists in this device's available services
      const availableServices = response.json.radiotime.item
      const hasService = availableServices.some((item) => {
        return (
          item.$ &&
          ((item.$.service && item.$.service === service) || (item.$.URL && item.$.URL === service))
        )
      })

      if (!hasService) {
        console.log(`Device ${device.name} does not have ${service} service available`)
        return false
      }

      // For Capture service (Inputs), we need to check specific input types
      if (service === 'Capture' && selectedPreset && selectedPreset.$.inputType) {
        try {
          // Get the specific inputs available on this device
          const inputsResponse = await window.api.loadSDUIPage(
            `http://${device.ip}:11000/RadioBrowse?service=Capture&url=presets&key=Music`
          )

          if (!inputsResponse || !inputsResponse.json || !inputsResponse.json.radiotime) {
            console.warn(`Device ${device.name} returned invalid inputs response`)
            return false
          }

          // Check if this device has the specific input type
          const availableInputs = inputsResponse.json.radiotime.item || []
          const hasSpecificInput = availableInputs.some((input) => {
            return input.$ && input.$.inputType === selectedPreset.$.inputType
          })

          if (!hasSpecificInput) {
            const inputTypeName =
              selectedPreset.$.inputType === 'analog'
                ? 'analog input'
                : selectedPreset.$.inputType === 'spdif'
                  ? 'optical input'
                  : selectedPreset.$.inputType === 'arc'
                    ? 'HDMI ARC'
                    : selectedPreset.$.inputType === 'phono'
                      ? 'phono input'
                      : selectedPreset.$.inputType === 'bluetooth'
                        ? 'Bluetooth'
                        : selectedPreset.$.inputType
            console.log(`Device ${device.name} does not have ${inputTypeName} available`)
            return false
          }
        } catch (error) {
          console.error(`Error checking input types for device ${device.name}:`, error)
          return false
        }
      }

      return true
    } catch (error) {
      console.error(`Error checking compatibility for device ${device.name}:`, error)
      return false
    }
  }

  const resetPreset = () => {
    setSelectedPreset(null)
  }

  return (
    <>
      <Dialog
        open={isAddpresetPageShown}
        onOpenChange={(open) => {
          setIsAddpresetPageShown(open)
          // Reset state when dialog closes
          if (!open) {
            resetPreset()
            setSelectedService(null)
            setBreadcrumbItems([])
            setRadiotime([])
            setIsApplyToAllPlayers(false)
            setPresetNumber(1)
            setPresetName('')
          }
        }}
      >
        <DialogContent className="w-full max-w-xl xl:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add Preset</DialogTitle>
          </DialogHeader>
          <Select
            value={selectedService || ''}
            onValueChange={(e) => {
              setSelectedService(e)
              console.log(e)

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
                  <Select
                    value={String(presetNumber)}
                    onValueChange={(e) => setPresetNumber(Number(e))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Slot" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
                        <SelectItem key={index} value={String(item)}>
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
              checked={isApplyToAllPlayers}
              onCheckedChange={(e) => setIsApplyToAllPlayers(e)}
            />
            <Label htmlFor="save-to-all">Save to all devices</Label>
            <Button onClick={handleSavePreset} disabled={isApplying}>
              {isApplying ? 'Applying...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddPresetPage
