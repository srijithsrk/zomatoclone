module.exports = function (idArr) {
    var orArr =[];
    for(var i in idArr){
        orArr.push( {
            "hasura_id": {
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
                "table": "user_table",
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