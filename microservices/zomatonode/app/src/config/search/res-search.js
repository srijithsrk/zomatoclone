module.exports = function (locality) {
    options = {
        url: 'https://data.bodybuilder89.hasura-app.io/v1/query',
        json: true,
        method: 'post',
        body:{
            "type": "select",
            "args": {
                "table": "res_table",
                "columns": [
                    "city",
                    "res_id",
                    "res_long",
                    "res_lat"
                ],
                "where": {
                    "city": {
                        "$eq": locality
                    }
                }
            }
        }
    };
    return options;
}
