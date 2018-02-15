var express = require('express');
var Promise = require('bluebird');
var request = require('request-promise');
var router = express.Router();
var app = express();
var userDetails = require('../config/user_details');
var hasuraInfo = require('../config/hasura-info');
var createAcc = require('../config/create-account');
var changeName = require('../config/change_name');
router.route('/').get(function (req, res) {
   var reqOpt = hasuraInfo(req.cookies.bodybuilder89);
    request(reqOpt)
        .then(function (body) {
            var hasura_id = [body.hasura_id];
            var reqOpt = userDetails(hasura_id);
            request(reqOpt)
                .then(function (body) {
                    if (!body.length) {
                        res.send('Account Not Created');
                    }
                    else {
                        if (body[0].photo_id) {
                            body[0].photo_url = 'https://filestore.bodybuilder89.hasura-app.io/v1/file/' + body[0].photo_id;
                        }
                        else {
                            body[0].photo_url = 'No Photo'
                        }
                        res.send(body);
                    }
                })
                .catch(function (err) {
                    res.send('Something Went Wrong');
                })
        })
        .catch(function (err) {
            res.redirect('Not Logged In');
        })
});

router.route('/update').post(function (req,res) {
    var name = req.body.name;
    request(hasuraInfo(req.cookies.bodybuilder89))
        .then(function (body) {
            var id = body.hasura_id;
            request(userDetails([id]))
                .then(function (body) {
                    if (!body.length) {
                        request(createAcc(id, name,req.cookies.bodybuilder89))
                            .then(function (body) {
                                res.send('Account With name '+name+' created!!');
                            })
                            .catch(function (err) {
                                res.send('Something Went Wrong');
                            })
                    }
                    else {
                        request(changeName(id, name, req.cookies.bodybuilder89))
                            .then(function (body) {
                                res.send(body);
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
        .catch(function (err) {
            res.redirect('Not Logged In');
        })
});

module.exports = router;