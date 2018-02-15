module.exports = function (table_name) {
    options = {
        url: 'https://data.bodybuilder89.hasura-app.io/v1/query',
        json: true,
        method: 'post',
        body:{
            "type": "select",
            "args": {
                "table": table_name,
                "columns": [
                    "*"
                ]
            }
        }
    };
    return options;
}

