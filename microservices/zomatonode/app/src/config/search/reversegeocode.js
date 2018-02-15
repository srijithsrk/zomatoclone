require('dotenv').config('../../')
module.exports = function (lat, lng){
    var key = process.env.GOOGLE_KEY;
    var requestOption = {
        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`,
        method: 'GET',
        json: true
    }
    return requestOption;
}