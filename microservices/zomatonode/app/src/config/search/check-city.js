module.exports = function (locality) {
    optition ={
        body: {
            "type": "select",
            "args": {
                "table": "ciry_table_index",
                "columns": [
                    "*"
                ],
                "where": {
                    "city": {
                        "$eq": locality
                    }
                }
            }
        },
        url: 'https://data.bodybuilder89.hasura-app.io/v1/query',
        method: 'post',
        json: true
    };
    return optition;
}
