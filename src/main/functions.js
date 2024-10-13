import xml2js from 'xml2js'
import wifi from 'node-wifi'

export const checkUpgrade = async (ip) => {
  try {
    const res = await fetch(`http://${ip}:11000/upgrade?upgrade=check`)

    const textResponse = await res.text()

    const xmlPart = textResponse.match(/<\?xml.*<\/upgrade>/s)

    let response

    if (xmlPart && xmlPart[0]) {
      const xmlContent = xmlPart[0]

      // Step 2: Parse the XML part using xml2js
      const parser = new xml2js.Parser()
      parser.parseString(xmlContent, (err, result) => {
        if (err) {
          console.error('Failed to parse XML:', err)
          return
        }

        // Step 3: Access the JSON data
        const upgradeData = result.upgrade.$
        response = {
          inProgress: upgradeData.inProgress,
          version: upgradeData.version,
          available: upgradeData.available
        }
      })
    }

    return response
  } catch (error) { }
}

export const getCurrentWifi = async () => {
  try {
    wifi.init({
      iface: null // network interface, choose a specific interface or leave it null for automatic selection
    });

    const connectedWifi = await wifi.getCurrentConnections()
    if (connectedWifi && connectedWifi.length > 0) {
      return connectedWifi[0].ssid
    } else {
      return null
    }

  } catch (error) {
    console.log(error)
  }
}

export const loadSDUIPage = async (url, debug) => {
  try {
    const res = await fetch(url)
    const xmlText = await res.text()
    const xml = await xml2js.parseStringPromise(xmlText)
    if (debug) {
      console.log(xml);
    }

    return {json:xml, xmlText}
  } catch (error) {
    console.log(error)
  }
}