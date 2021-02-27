/**
 * Response Object
 * @param {Boolean} isSuccess if the request was succesful
 * @param {String} errorName the kind of error the server had
 * @param {Object} payload the dta to be returned
 */
class Response {
    constructor(isSuccess, errorName, payload) {
        this.isSuccess = isSuccess;
        this.errorName = errorName;
        this.payload = payload;
    }
}

module.exports = { Response }