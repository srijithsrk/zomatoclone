require('dotenv').config('../../');
module.exports = function (table_name,orArray,comp) {
    var body = '';
    for(var prop in orArray){
        body = body+orArray[prop].trim()+'|';
    }
    body = body.slice(0, -1);

    options = {
        url: 'https://data.bodybuilder89.hasura-app.io/v1/query',
        json: true,
        method: 'post',
        headers: {
            'Authorization': 'Bearer ' +process.env.ADMIN_TOKEN
        },
        body: {
            "type": "run_sql",
            "args": {
                "sql":"select array_to_json(array_agg(row_to_json(t)))"
                      + ` from (SELECT res_id FROM ${table_name} WHERE ${comp} ~* '${body}')t;`

            }
        }



    };
    return options;
}
