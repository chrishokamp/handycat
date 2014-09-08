'use strict';

var path = require('path'),
    auth = require('../config/auth');

module.exports = function(app) {
  // User Routes
  var users = require('../controllers/users');
  app.post('/auth/users', users.create);
  app.get('/auth/users/:userId', users.show);

  // TAUS data API routes
  // note: a new user needs to register with TAUS for this to work
  // Direct users here to register for an account: http://www.tausdata.org/index.php/component/users/?view=registration
  app.post('/users/tausdata', users.setTausData);

  // sample call to the TAUS segment API
  // https://www.tausdata.org/api/segment.json?source_lang=en-US&target_lang=fr-FR&q=data+center
  // TODO: create routes for interacting with TAUS data
  // TODO: graceful warnings and fallback if the API isn't working, or the user isn't registered

  // Check if username is available
  app.get('/auth/check_username/:username', users.exists);

  // Session Routes
  var session = require('../controllers/session');
  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  app.delete('/auth/session', session.logout);


  // Translation Project Routes - these routes let users interact with their projects
  var projects = require('../controllers/projects');
  // Chris - ensureAuthenticated middleware controls access to the route
  // TODO: remove this temporary route after building RESTful API

//  app.get('/api/project',auth.ensureAuthenticated, function(req,));

  app.get('/api/projects',auth.ensureAuthenticated, projects.all);
  app.post('/api/projects', auth.ensureAuthenticated, projects.create);
  app.get('/api/projects/:projectId', auth.ensureAuthenticated, projects.show);
  app.put('/api/projects/:projectId', auth.ensureAuthenticated, auth.project.hasAuthorization, projects.update);
  app.delete('/api/projects/:projectId', auth.ensureAuthenticated, auth.project.hasAuthorization, projects.destroy);

  //Setting up the projectId param
  app.param('projectId', projects.project);


  // Angular Routes -- chris - how to use these?
  // Note: in the demo app, the structure is /views/partials/..., so here we are appending to the /views param
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
//    res.render('index.html');
  });

}