/**
 * Created by ChristianFernando on 12/27/2015.
 */
'use strict';

var express = require('express');
var controller = require('./../../api/user/user.controller');

var router = express.Router();



router.post('/login', controller.sign);

module.exports = router;
