var debug = require('debug')('auth');
var passport = require('passport');
/**
 *  Route middleware to ensure user is authenticated.
 */
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.status(401).end();
};

// WORKING - ensure that the authenticated user has access to the data they are requesting
exports.user = {
  hasAuthorization: function(req, res, next) {
    debug('AUTH USER');
    debug(req.sessionID);
    debug(req.session.passport);
    //debug(passport.deserializeUser(req.sessionID));
    //if (req.project.creator._id.toString() !== req.user._id.toString()) {
    //  return res.status(403).end();
    //}
    next();
  }
};

/**
 * Project authorizations routing middleware
 */
// TODO: extend this middleware to accomodate shared projects
// we currently rely on passport's placing req.session.passport.user
// TODO: by default, a user should only see their own projects
// TODO: this requires adding a 'shared_with' field to the resource -- add the user ids of the users who can access this project
exports.project = {
  hasAuthorization: function(req, res, next) {
    debug('PROJECT AUTH');
    debug(req.project.creator._id.toString());
    if (req.project.creator._id.toString() !== req.session.passport.user.toString()) {
      debug('USER: ' + req.project.creator._id.toString() + ' NOT AUTHORIZED');
      return res.status(403).end();
    }
    next();
  }
};

/**
 * resource authorization middleware
 */
