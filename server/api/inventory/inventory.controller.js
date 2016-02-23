/**
 * Created by ChristianFernando on 12/27/2015.
 */


var _ = require('lodash');
var UserModel = require('./../user/user.model');

exports.inventoryByUserId = function(req, res) {
  var id = req.params.id;

  if(!isNaN(id)) {
    UserModel.getInventory(id,function(error, data) {

      if (typeof data !== 'undefined' && data.length > 0) {

        res.status(201).json(data);
      }

      else {
        res.status(404).json({"msg":"notExist"});
      }
    });
  }
  else {
    res.json(500,{"msg":"The id must be numeric"});
  }
};
