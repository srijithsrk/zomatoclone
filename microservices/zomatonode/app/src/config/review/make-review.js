module.exports = function (table, resId, hasura_id, stars, text, cookie) {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var newdate = year + "/" + month + "/" + day;

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
                "table": table,
                "objects": [
                    {
                        "review_text": text,
                        "hasura_id": hasura_id,
                        "stars": stars,
                        "date": newdate,
                        "res_id": resId
                    }
                ]
            }
        }
    };

    return reqOpt;
}