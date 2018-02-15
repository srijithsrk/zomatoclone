var express = require('express');
var Promise = require('bluebird');
var request = require('request-promise');
var router = express.Router();
var geodist = require('geodist');
var app = express();
var configCityIndex = require('../config/search/check-city');
var configSearchById = require('../config/search/res-by-id')
var configUserDetails = require('../config/user_details')
router.route('/').post(function (req, res) {
   var res_id = req.body.res_id;
   var city = req.body.city;
   res.redirect('/restaurant/'+city+'/?res_id='+res_id);
});

router.route('/:locality/').get(function (req, res) {
    var locality = req.params.locality.toLowerCase();
    var res_id = req.query.res_id;
    var reqOptions = configCityIndex(locality);
    request(reqOptions)
        .then(function (body) {
            var rest = body[0].res_table;
            var cusine = body[0].cuisine_tbale;
            var rev = body[0].review_table;
            var tags = body[0].tag_table;
            var image = body[0].image_tabale;
            var menu = body[0].menu_table;
            var requestOption = [configSearchById(rest,res_id), configSearchById(cusine, res_id), configSearchById(rev,res_id),
                                configSearchById(image, res_id), configSearchById(menu,res_id)];
            Promise.map(requestOption, function (obj) {
                return request(obj)
                    .then(function (body) {
                        return body;
                    })
            })
                .then(function (body) {
                    var res_json = body[0];
                    var cusine_json = body[1];
                    var rev_json = body[2];
                    var image_json = body[3];
                    var menu_json = body[4];
                    if (!res_json.length) {
                        res.status(404);
                        res.send('Page Not Found');
                    }
                    else {
                        var user_id = [];
                        for (var i in rev_json) {
                            user_id.push(rev_json[i].hasura_id);
                        }
                        var reqOption = configUserDetails(user_id);
                        request(reqOption)
                            .then(function (user_json) {
                                var cuisine = [];
                                var review = 0;
                                var reviewers = 0;
                                var review_texts = [];
                                var review_ovr;
                                var images = [];
                                var menu = [];
                                for (var i in cusine_json) {
                                    cuisine.push(cusine_json[i].cuisine);
                                }
                                for (var i in rev_json) {
                                    for(var j in user_json){
                                        if(user_json[j].hasura_id === rev_json[i].hasura_id){
                                            review_texts.push({
                                                rev_id: rev_json[i].review_id,
                                                user_id: user_json[j].hasura_id,
                                                name: user_json[j].name,
                                                stars: rev_json[i].stars,
                                                text: rev_json[i].review_text,
                                                date: rev_json[i].date,
                                                table: rev
                                            });
                                        }
                                    }
                                    review = review + rev_json[i].stars;
                                    reviewers++;
                                }
                                if(reviewers !== 0){
                                    review = review/reviewers;
                                    review_ovr = {
                                        avg_rev: review,
                                        reviewers: reviewers
                                    };
                                }
                                if(reviewers === 0){
                                    review_texts = 'No Reviews Yet';
                                }
                                for(var i in image_json){
                                    images.push('https://filestore.bodybuilder89.hasura-app.io/v1/file/'+ image_json[i].photo_id);
                                }
                                for(var i in menu_json){
                                    menu.push('https://filestore.bodybuilder89.hasura-app.io/v1/file/'+ menu_json[i].photo_id);
                                }
                                res_json[0].cuisines = cuisine;
                                res_json[0].reviews = review_texts;
                                res_json[0].review_ovr = review_ovr;
                                res_json[0].img_url = images;
                                res_json[0].menu_url = menu;
                                res.send(res_json);
                            })
                            .catch(function (err) {
                                res.send('Something Went Wrong');
                            })
                    }
        })
                .catch(function (err) {
                    res.send('Something Went Wrong');
                })
        })
});
module.exports = router;