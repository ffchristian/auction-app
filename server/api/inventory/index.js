/**
 * Created by ChristianFernando on 12/27/2015.
 */
'use strict';

var express = require('express');
var controller = require('./inventory.controller');

var router = express.Router();

router.get('/:id', controller.inventoryByUserId);

module.exports = router;
