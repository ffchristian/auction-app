'use strict';

var _ = require('lodash');
var UserModel = require('./user.model');
var utils = require('./../../components/utils');
var auth = require('../../components/auth/auth.service');
// Get list of users
exports.index = function(req, res) {
  UserModel.getUsers(function(error, data) {
    if (typeof data !== 'undefined') {
      res.status(201).json(data);
    }
    else {
      res.status(404).json({"msg":"notExist"});
    }
  });
};

exports.getUser = function(req, res) {
  var id = req.params.id;
  UserModel.getUser(id,function(error, data) {

    if (typeof data !== 'undefined') {
      res.status(201).json(data);
    }

    else {
      res.status(404).json({"msg":"notExist"});
    }
  });
};

exports.sign = function(req, res) {
  var username = req.body.username;



  UserModel.getUserByUserName(username,function(error, data) {

    if (typeof data !== 'undefined' && data.length > 0) {
      _.remove(utils.connectedUsers, function(user) {
        return user.id == data[0].id;
      });
      var token = auth.signToken(data[0].id);
      utils.connectedUsers.push({id:data[0].id, token:token});
      return res.status(201).json({token: token});

    }
    else {
      req.body = {username:username, coins:1000}
      exports.newUser(req, res);
    }
  });

};

exports.newUser = function(req, res) {

  var userData = {
    id : null,
    username : req.body.username,
    coins : req.body.coins,
    //created_at : null
  };
  UserModel.insertUser(userData,function(error, data) {
    if(error) return res.status(500).json({"msg":"SERVER_ERROR"});

    if(data && data.insertId) {
      userData.id = data.insertId;
      _.remove(utils.connectedUsers, function(user) {
        return user.id == userData.id;
      });
      var token = auth.signToken(userData.id);
      utils.connectedUsers.push({id:userData.id, token:token});
      return res.status(201).json({token: token});
    }

  });

};

/**
 * Get my info
 */
exports.me = function(req, res, next) {

  res.json(req.user);

};
