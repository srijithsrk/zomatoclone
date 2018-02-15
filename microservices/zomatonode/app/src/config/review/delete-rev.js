module.exports = function (table, rev_id, cookie) {

    var reqOpt= {
        url: 'https://data.bodybuilder89.hasura-app.io/v1/query',
        json: true,
        method: 'post',
        "headers": {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + cookie
        },
        body:{
            "type": "delete",
            "args": {
                "table": table,
                "where": {
                    "review_id": {
                        "$eq": rev_id
                    }
                }
            }
        }
    };

    return reqOpt;
}
