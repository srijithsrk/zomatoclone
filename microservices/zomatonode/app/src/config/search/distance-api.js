var Promise = require('bluebird');
var request = require('request-promise');
require('dotenv').config('../../')
module.exports = function (lat_org,lng_org,lat_dest, lng_dest){
    var key = process.env.GOOGLE_KEY;
    var requestOption = {
        url: `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${lat_org},${lng_org}&destinations=${lat_dest},${lng_dest}&key=${key}`,
        method: 'GET',
        json: true
    }
    return requestOption;
}