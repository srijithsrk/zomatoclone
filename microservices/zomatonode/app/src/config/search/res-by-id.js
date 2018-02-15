module.exports = function (table_name, idArr) {
    var orArr =[];
    for(var i in idArr){
        orArr.push( {
            "res_id": {
                "$eq": idArr[i]
            }
        })
    }
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
                ],
                "where": {
                    "$or": orArr
                }
            }
        }
    };
    return options;
}

