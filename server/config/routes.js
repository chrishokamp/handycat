'use strict';

var path = require('path'),
    auth = require('../config/auth');

module.exports = function(app) {
  // User Routes
  var users = require('../controllers/users');
  app.post('/auth/users', users.create);
  app.get('/auth/users/:userId', users.show);

  // Check if username is available
  // todo: probably should be a query on users
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
  app.get('/api/projects/:projectId', projects.show);
  app.put('/api/projects/:projectId', auth.ensureAuthenticated, auth.project.hasAuthorization, projects.update);
  app.delete('/api/projects/:projectId', auth.ensureAuthenticated, auth.project.hasAuthorization, projects.destroy);

  //Setting up the projectId param
  app.param('projectId', projects.project);

  // Angular Routes
  app.get('/partials/*', function(req, res) {
    var requestedView = path.join('./', req.url);
    res.render(requestedView);
  });

  app.get('/*', function(req, res) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.user_info));
    }

    res.render('../../app/index.html');
  });

}