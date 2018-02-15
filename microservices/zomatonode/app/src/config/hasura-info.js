module.exports = function (cookie) {
    var reqOpt = {
        url: 'https://auth.bodybuilder89.hasura-app.io/v1/user/info',
        method: 'GET',
        json: true,
        "headers": {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + cookie
        }
    }
    return reqOpt;
}
