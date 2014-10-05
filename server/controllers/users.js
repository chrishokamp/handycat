'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  passport = require('passport'),
  ObjectId = mongoose.Types.ObjectId;

/**
 * Create user
 * requires: {username, password, email}
 * returns: {email, password}
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';

  newUser.save(function(err) {
    if (err) {
      return res.json(400, err);
    }

    req.logIn(newUser, function(err) {
      if (err) return next(err);
      return res.json(newUser.user_info);
    });
  });
};

/**
 *  Show profile
 *  returns {username, profile}
 */
exports.show = function (req, res, next) {
//  var userId = req.params.userId;
  var userId = req.user._id
  console.log('User id is:');
  console.log(userId);

  User.findById(ObjectId(userId), function (err, user) {
    if (err) {
      return next(new Error('Failed to load User'));
    }
    if (user) {
      console.log('Found User:');
      console.log(user);
      res.send({username: user.username, userId: user._id });
    } else {
      res.send(404, 'USER_NOT_FOUND')
    }
  });
};

/**
 *  Username exists
 *  returns {exists}
 */
exports.exists = function (req, res, next) {
  var username = req.params.username;
  User.findOne({ username : username }, function (err, user) {
    if (err) {
      return next(new Error('Failed to load User ' + username));
    }

    if(user) {
      res.json({exists: true});
    } else {
      res.json({exists: false});
    }
  });
}

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
  console.log('user controller - id: ' + id);
  User.load(id, function(err, user) {
    console.log('User Loaded');
    console.log(user)
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load user ' + id));
    // testing1
    req.aUser = user;
    next();
  });
};

exports.setTausData = function (req, res, next) {
  var userId = req.body.userId;
  var tausUsername = req.body.tausUsername;

  // Remember that the taus password is Base64 encoded when using TAUS Basic HTTP Auth
  var tausPassword = req.body.tausPassword;

  if (!tausUsername || !tausPassword) {
    return next(new Error('tausUsername or tausPassword fields are not parsable as strings'));
  }

  User.findById(ObjectId(userId), function (err, user) {
    if (err) {
      return next(new Error('Failed to load User'));
    }
    if (user) {
      user.update({'tausUsername': tausUsername, 'tausPassword': tausPassword})
      res.send(200, "User's TAUS data was updated");
    } else {
      res.send(404, 'USER_NOT_FOUND')
    }
  });
}

exports.queryTM = function (req, res, next) {
  var userId = req.params.userId;

  // see using express with HTTP basic Auth
//      $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
  User.findById(ObjectId(userId), function (err, user) {
    if (err) {
      return next(new Error('Failed to load User'));
    }
    if (user) {
      var tausUsername = user.tausUsername;
      var tausPassword = user.tausPassword;
      console.log('tausUsername: ' + tausUsername);
      console.log('tausPassword: ' + tausPassword);
//      res.send(200, "User's TAUS data was updated");
      res.send(200);
    } else {
      res.send(404, 'USER_NOT_FOUND')
    }
  });


  // TODO: check if user has login credentials for this TM
  if (!tausUsername || !tausPassword) {
    return next(new Error('tausUsername or tausPassword fields are not parsable as strings'));
  }

  // retrieve the user from mongo, get the taus credentials, and call the taus api with the query

}

/**
 * Update a user
 */
exports.update = function(req, res) {
  // TODO - where does req.user come from? - is it provided by $resource?
  var user = req.user;
  var id = user._id;
//  delete user._doc._id;

  var tausUsername = req.body.tausUsername;
  var tausPassword = req.body.tausPassword;
//  user.save(function(err) {
  User.update({ '_id': id }, {$set: { tausUsername: tausUsername, tausPassword: tausPassword}}, function(err, doc) {
    if (err) {
      console.log('Error in user update');
      console.log(err)
      res.json(500, err);
    } else {
      user.tausUsername = req.body.tausUsername;
      user.tausPassword = req.body.tausPassword;
      res.json(doc);
    }
  });
};

/**
 * Delete a project
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
