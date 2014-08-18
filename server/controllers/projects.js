'use strict';

var mongoose = require('mongoose'),
  Blog = mongoose.model('Project');

/**
 * Find blog by id
 */
exports.project = function(req, res, next, id) {
  Project.load(id, function(err, project) {
    if (err) return next(err);
    if (!project) return next(new Error('Failed to load project ' + id));
    req.project = project;
    next();
  });
};

/**
 * Create a blog
 */
exports.create = function(req, res) {
  var project = new Project(req.body);
  project.creator = req.user;

  project.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(project);
    }
  });
};

/**
 * Update a project
 */
exports.update = function(req, res) {
  var project = req.project;
  project.title = req.body.title;
  project.content = req.body.content;
  project.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(project);
    }
  });
};

/**
 * Delete a blog
 */
exports.destroy = function(req, res) {
  var project = req.project;

  project.remove(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(project);
    }
  });
};

/**
 * Show a blog
 */
exports.show = function(req, res) {
  res.json(req.project);
};

/**
 * List of Blogs
 */
exports.all = function(req, res) {
  Project.find().sort('-created').populate('creator', 'username').exec(function(err, projects) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(projects);
    }
  });
};