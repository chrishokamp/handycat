'use strict';

var path = require('path'),
    auth = require('../config/auth');

module.exports = function(app) {

  // User Routes
  var users = require('../controllers/users');

  // TODO: testing only
  app.param('userId', auth.user.hasAuthorization);

  // Check if username is available
  app.get('/auth/check_username/:username', users.exists);
  app.post('/auth/users', users.create);
  app.get('/auth/users/:userId', users.show);

  // todo: this lets any logged-in user update another user's data
  app.put('/auth/users/:userId', auth.ensureAuthenticated, users.update);
  app.delete('/auth/users/:userId', auth.ensureAuthenticated, users.destroy);

  // TAUS data API routes - TODO - extend this into a general interface to translation memories - move taus-specific code outside of this module
  // Working - use named resources to map a user's available resources to their URLs
  // note: a new user needs to register with TAUS - or the specific translation service for this to work
  // Direct users here to register for an account: http://www.tausdata.org/index.php/component/users/?view=registration
  // sample call to the TAUS segment API
  // https://www.tausdata.org/api/segment.json?source_lang=en-US&target_lang=fr-FR&q=data+center
  app.post('/users/tausdata', users.setTausData);
  // call the taus data API with source_lang=en-US, target_lang=fr-FR, q=<user query>

  // TODO: this route should actually add add an entry to one or more TMs, not set the user's taus data
  app.post('/users/tm', auth.ensureAuthenticated, users.setTausData);
//  app.get('/users/tm', auth.ensureAuthenticated, users.queryTM);

  // Working - implement /users/:userId/tm - this user's TM resources
  // if there isn't an entry in the user's tm, ask the global TM
  app.get('/users/:userId/tm', auth.ensureAuthenticated, users.checkTMCache, users.queryTM);
  // TODO - add a 'global' user whose resources are accessible to every other user (i.e. global.checkTMCache)

  // Resource routes
  // app.get('/translate', resource.checkCache, resource.translate);
  // for each resource that the user can access, check to see if the
  // when we hit this route, first check the cache to see if we already know the translation
  // the cache is a graph tm instance
  // if we do retrieve a translation, add it to the cache

  // adding resources -- because different resources have completely different APIs and signatures
  // we need to recognize resources by name, and call different functions based on the name of the resource
  // the resource management component is complex and standalone enough to be another app

  // TODO: make sure that we are getting the cache item from the SAME RESOURCE
  // the cache needs to store the resource by name, because we need to query on that

  // Session Routes
  var session = require('../controllers/session');

  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  app.delete('/auth/session', session.logout);


  // Translation Project Routes - these routes let users interact with their projects
  var projects = require('../controllers/projects');

  // this makes req.project available (via a side-effect)
  app.param('projectId', projects.project);

  app.get('/api/projects',auth.ensureAuthenticated, projects.all);
  app.post('/api/projects', auth.ensureAuthenticated, projects.create);
  app.get('/api/projects/:projectId', auth.ensureAuthenticated, projects.show);
  app.put('/api/projects/:projectId', auth.ensureAuthenticated, auth.project.hasAuthorization, projects.update);
  app.delete('/api/projects/:projectId', auth.ensureAuthenticated, auth.project.hasAuthorization, projects.destroy);

  // Angular Routes
  // here we are appending to the /views param because web.js sets it up that way
  app.get('/partials/*', function(req, res) {
    var requestedView = path.join('./', req.url);
    res.render(requestedView);
  });

  app.get('/*', function(req, res) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.user_info));
    }

    // express will look for this in the path under the 'views' property (see web.js)
    res.render('index.html');
  });

}
