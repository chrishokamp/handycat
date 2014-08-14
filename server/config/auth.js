'use strict';

/**
 *  Route middleware to ensure user is authenticated.
 */
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send(401);
}

/**
 * Blog authorizations routing middleware
 */
// TODO: extend this to make it work for our routes -- users need access to projects, xliff files, etc...
//exports.blog = {
//  hasAuthorization: function(req, res, next) {
//    if (req.blog.creator._id.toString() !== req.user._id.toString()) {
//      return res.send(403);
//    }
//    next();
//  }
//};