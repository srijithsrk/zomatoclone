var express = require('express');
var Promise = require('bluebird');
var request = require('request-promise');
var router = express.Router();
var app = express();
var hasuraInfo = require('../config/hasura-info');
var cityIndex = require('../config/search/check-city');
var makeReview = require('../config/review/make-review');
var deleteRev = require('../config/review/delete-rev');

router.route('/makereview').post(function (req,res) {
   var res_id = req.body.res_id;
   var city = req.body.city;
   var stars = req.body.stars;
   var review_text = req.body.review_text;
   var reqOpt = hasuraInfo(req.cookies.bodybuilder89);
   request(reqOpt)
       .then(function (body){
           var id = body.hasura_id;
           request(cityIndex(city))
               .then(function (body) {
                   var rev = body[0].review_table;
                   request(makeReview(rev,res_id,id,stars,review_text,req.cookies.bodybuilder89))
                       .then(function (body) {
                           res.send('success');
                       })
                       .catch(function (err) {
                           res.send('Something Went Wrong');
                       })
               })
               .catch(function (err) {
                   res.send('Something Went Wrong');
               })
       })
       .catch(function (err) {
           res.send('Not Logged In');
       })
});

router.route('/delete').post(function (req,res) {
   var rev_id = req.body.rev_id;
   var table = req.body.table;
   var reqOpt = hasuraInfo(req.cookies.bodybuilder89);
    request(reqOpt)
        .then(function (body) {
            var id = body.hasura_id;
            request(deleteRev(table,rev_id,req.cookies.bodybuilder89))
                .then(function (body) {
                    if(body.affected_rows === 0){
                        res.send('Not Authorized');
                    }
                    else {
                        res.send('Success');
                    }
                })
                .catch(function (err) {
                    res.send('Something Went Wrong');
                })

        })
        .catch(function (err) {
            res.send('Not Logged In')
        })

});

module.exports = router;
