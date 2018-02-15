module.exports = function (id, name, cookie) {
    var reqOpt= {
        url: 'https://data.bodybuilder89.hasura-app.io/v1/query',
        json: true,
        method: 'post',
        "headers": {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + cookie
        },
        body:{
            "type": "update",
            "args": {
                "table": "user_table",
                "where": {
                    "hasura_id": {
                        "$eq": id
                    }
                },
                "$set": {
                    "name": name
                }
            }
        }
    };

    return reqOpt;
}
