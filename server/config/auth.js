'use strict';

/**
 *  Route middleware to ensure user is authenticated.
 */
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.status(401).end();
};

/**
 * Project authorizations routing middleware
 */
// TODO: extend this middleware to accomodate shared projects
// TODO: by default, a user should only see their own projects
// TODO: this requires adding a 'shared_with' field to the resource -- add the user ids of the users who can access this project
exports.project = {
  hasAuthorization: function(req, res, next) {
    if (req.project.creator._id.toString() !== req.user._id.toString()) {
      return res.status(403).end();
    }
    next();
  }
};

/**
 * resource authorization middleware
 */