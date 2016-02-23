'use strict';

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();


router.get('/', controller.index);
router.get('/me', controller.me);
router.get('/:id', controller.getUser);
router.get('/sign/:username', controller.sign);

module.exports = router;
