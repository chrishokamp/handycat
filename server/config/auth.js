'use strict';

/**
 *  Route middleware to ensure user is authenticated.
 */
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send(401);
}

/**
 * Project authorizations routing middleware
 */
// TODO: extend this middleware to accomodate shared projects
// TODO: by default, a user should only see their own projects
exports.project = {
  hasAuthorization: function(req, res, next) {
    if (req.project.creator._id.toString() !== req.user._id.toString()) {
      return res.send(403);
    }
    next();
  }
};