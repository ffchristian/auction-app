'use strict';

var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../../api/user/user.model');
var validateJwt = expressJwt({ secret: config.secrets.session });
var utils = require('./../../components/utils');
var _ = require('lodash');
/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      //console.log('authorization==>',req.headers.authorization);
      if(req.query && req.query.hasOwnProperty('access_token')) {

        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }

      var index = _.findIndex(utils.connectedUsers, function(user) {
        return 'Bearer ' +user.token == req.headers.authorization;
      });
      if(index<0) req.headers.authorization = 'Bearer';
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
      User.getUser(req.user._id, function (err, user) {
        if (err) return next(err);
        if (!user) return res.status(401).send('Unauthorized');

        req.user = user;
        next();
      });
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        res.status(403).send('Forbidden');
      }
    });
}


/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  //return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*5 });
  return jwt.sign({ _id: id }, config.secrets.session, { expiresIn: 10*10000 });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) return res.status(404).json({ message: 'Something went wrong, please try again.'});
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
