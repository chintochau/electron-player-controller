import xml2js from 'xml2js'

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
        console.log({
          inProgress: upgradeData.inProgress,
          version: upgradeData.version,
          available: upgradeData.available
        })

        response = {
          inProgress: upgradeData.inProgress,
          version: upgradeData.version,
          available: upgradeData.available
        }
      })
    }

    return response
  } catch (error) {}
}
