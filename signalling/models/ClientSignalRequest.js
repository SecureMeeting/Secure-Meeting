/**
 * Response Object
 * @param {String} countryCode the kind of error the server had
 * @param {String} countryName the dta to be returned
 * @param {String} regionCode the kind of error the server had
 * @param {String} regionName the dta to be returned
 * @param {String} isp the kind of error the server had
 * @param {String} zipCode the dta to be returned
 * @param {String} timeZone the kind of error the server had
 * @param {String} latitude the dta to be returned
 * @param {String} longitude the kind of error the server had
 */
class ClientSignalRequest {
  constructor(
    countryCode,
    countryName,
    regionCode,
    regionName,
    isp,
    zipCode,
    timeZone,
    latitude,
    longitude
  ) {
    this.countryCode = countryCode;
    this.countryName = countryName;
    this.regionCode = regionCode;
    this.regionName = regionName;
    this.isp = isp;
    this.zipCode = zipCode;
    this.timeZone = timeZone;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

module.exports = { ClientSignalRequest };
