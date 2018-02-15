var express = require('express');
var Promise = require('bluebird');
var request = require('request-promise');
var router = express.Router();
var geodist = require('geodist');
var app = express();
var configGeoCode = require('../config/search/reversegeocode');
var configCheckCity = require('../config/search/check-city');
var configSQLRest= require('../config/search/query_rest');
var configSearchByCity = require('../config/search/search_by_city');
var configResById = require('../config/search/res-by-id');
router.route('/').post(function (req, res) {
    var lat = req.body.lat;
    var lng = req.body.lng;
    var query = req.body.query;
    var reqOptions = configGeoCode(lat, lng);
    request(reqOptions)
        .then(function (body) {
            body = body.results[0].address_components
            for( var prop in body){

                if(body[prop].types[0] == "locality" ){
                    break;
                }
            }
            var locality = body[prop].long_name;
            res.redirect(307,'/search/'+locality);
        })
        .catch(function (err) {
            res.send("Something Went Wrong");
        });


});

router.route('/:locality').post(function (req, res) {
   var locality = req.params.locality.toLowerCase();
   var reqOptions = configCheckCity(locality);
   request(reqOptions)
       .then(function (body) {
           if(body.length === 0){
               res.send("City Not Found"+ locality).status(404);
           }
           else {
               res.redirect(307,'/search/'+locality+'/query');
           }
       })
       .catch(function (err) {
           res.send("Something Went Wrong");
       })
});
router.route('/:locality/query').post(function (req, res) {
    var lat = req.body.lat;
    var lng = req.body.lng;
    var query = req.body.query;
    query = query.trim();
    var locality = req.params.locality.toLowerCase();
    if(!query){
        res.redirect(307,'/search/'+locality+'/all');
    }
    else {
        query = query.match(/\S+\s*/g);
        var reqOptions = configCheckCity(locality);
        request(reqOptions)
            .then(function (body) {
                var rest = body[0].res_table;
                var cusine = body[0].cuisine_tbale;
                var rev = body[0].review_table;
                var tags = body[0].tag_table;
                var reqOptions = [configSQLRest(rest, query, 'res_name'), configSQLRest(cusine, query, 'cuisine'), configSQLRest(tags, query, 'tag')];
                Promise.map(reqOptions, function (obj) {
                    return request(obj)
                        .then(function (body) {
                            return body;
                        })
                })
                    .then(function (body) {
                        for (var i in body) {
                            if (body[i].result[1][0] === 'NULL') {
                                body[i].result[1][0] = {}
                            }
                            else {
                                body[i].result[1][0] = JSON.parse(body[i].result[1][0]);
                            }
                        }
                        var rest_resp = body[0].result[1][0];
                        var cus_resp = body[1].result[1][0];
                        var tag_resp = body[2].result[1][0];
                        var id_arr = [];
                        for (var i in cus_resp) {
                            id_arr.push(cus_resp[i].res_id);
                        }
                        for (var i in tag_resp) {
                            id_arr.push(tag_resp[i].res_id);
                        }
                        for (var i in rest_resp) {
                            id_arr.push(rest_resp[i].res_id);
                        }
                        var reqOptions = [configResById(rest, id_arr), configResById(cusine, id_arr), configResById(rev, id_arr)];
                        Promise.map(reqOptions, function (obj) {
                            return request(obj)
                                .then(function (body) {
                                    return body;
                                })
                        })
                            .then(function (body) {
                                var res_json = body[0];
                                var cusine_json = body[1];
                                var rev_json = body[2];
                                var list = [];
                                for(var prop in res_json){
                                    var cuisine =[];
                                    var review = 0;
                                    var reviewers =0;
                                    for(var key in cusine_json){
                                        if(res_json[prop].res_id === cusine_json[key].res_id){
                                            cuisine.push(cusine_json[key].cuisine);
                                        }
                                    }
                                    for(var revs in rev_json){
                                        if(res_json[prop].res_id === rev_json[revs].res_id){
                                            review = review + rev_json[revs].stars;
                                            reviewers ++;
                                        }
                                    }
                                    if(reviewers !== 0){
                                        review = review/reviewers;
                                    }
                                    if(reviewers === 0){
                                        review = 'No Reviews Yet';
                                    }
                                    list.push({
                                        id: res_json[prop].res_id,
                                        name: res_json[prop].res_name,
                                        add: res_json[prop].res_add,
                                        city: locality,
                                        rev: review,
                                        cuisinie: cuisine,
                                        dist: geodist({lat: lat, lon: lng}, {lat: res_json[prop].res_lat, lon: res_json[prop].res_lng}, {exact: true, unit: 'km'})

                                    })
                                }
                                if(!list.length){
                                    res.send('No such restaurant found in '+ locality);
                                }
                                else {
                                    res.send(list);
                                }
                            })
                            .catch(function (err) {
                                res.send('Something Went Wrong');
                            })


                    })
                    .catch(function (err) {
                        res.send("Something Went Wrong");
                    })
            })
            .catch(function (err) {
                res.send("Something Went Wrong");
            })
    }

});
router.route('/:locality/all').post(function(req, res) {
    var lat = req.body.lat;
    var lng = req.body.lng;
    var locality = req.params.locality.toLowerCase();
    var reqOptions = configCheckCity(locality);
    request(reqOptions)
        .then(function (body) {
            var rest = body[0].res_table;
            var cusine = body[0].cuisine_tbale;
            var rev = body[0].review_table;
            var request_options = [configSearchByCity(rest), configSearchByCity(cusine),  configSearchByCity(rev)];
            Promise.map(request_options, function (obj) {
                return request(obj)
                    .then(function(body) {
                    return body;
                })
            }).then(function (body) { //body is array JSON fetched from request to above two url
                    var res_json = body[0];
                    var cusine_json = body[1];
                    var rev_json = body[2];
                    var list = [];
                    for(var prop in res_json){
                        var cuisine =[];
                        var review = 0;
                        var reviewers =0;
                        for(var key in cusine_json){
                            if(res_json[prop].res_id === cusine_json[key].res_id){
                                    cuisine.push(cusine_json[key].cuisine);
                            }
                        }
                        for(var revs in rev_json){
                            if(res_json[prop].res_id === rev_json[revs].res_id){
                                review = review + rev_json[revs].stars;
                                reviewers ++;
                            }
                        }
                        if(reviewers !== 0){
                            review = review/reviewers;
                        }
                        if(reviewers === 0){
                            review = 'No Reviews Yet';
                        }
                        list.push({
                            id: res_json[prop].res_id,
                            name: res_json[prop].res_name,
                            add: res_json[prop].res_add,
                            city: locality,
                            rev: review,
                            cuisinie: cuisine,
                            dist: geodist({lat: lat, lon: lng}, {lat: res_json[prop].res_lat, lon: res_json[prop].res_lng}, {exact: true, unit: 'km'})

                        })
                    }
                    res.send(list);
            }).catch(function (err) {
                res.send("Something Went Wrong");
            });
        });
});

module.exports = router;