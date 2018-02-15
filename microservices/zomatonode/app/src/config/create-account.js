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
            "type": "insert",
            "args": {
                "table": "user_table",
                "objects": [
                    {
                        "hasura_id":id,
                        "name": name
                    }
                ]
            }
        }
    };

    return reqOpt;
}
