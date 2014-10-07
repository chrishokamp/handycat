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
    // testing - put the user onto the req for downstream use
    req.user = user;
    next();
  });
};

// WORKING - generalize resource setup so that different resources can use the same interface
// --> getting data from the TM should look no different than getting data from a MT engine, or a human
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

var getJSON = require('../getJSON').getJSON;
exports.queryTM = function (req, res, next) {
  console.log('inside queryTM');

  // Working - the user should already be on the req
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
      // TODO: check if user has login credentials for this TM
      if (!tausUsername || !tausPassword) {
        return next(new Error('tausUsername or tausPassword fields are not parsable as strings'));
      }

//Username and password are combined into a string "username:password"
//The resulting string is then encoded using the RFC2045-MIME variant of Base64, except not limited to 76 char/line[9]
//The authorization method and a space i.e. "Basic " is then put before the encoded string.

      console.log('tausUsername: ' + tausUsername);
      console.log('tausPassword: ' + tausPassword);

      var combined = new Buffer(tausUsername + ':' + tausPassword).toString('base64');
      var from = 'source_lang=' + req.query.sourceLang;
      var to = 'target_lang=' + req.query.targetLang;
      // TODO: dynamically decide whether to use fuzzy=true or fuzzy=false
      var fuzzy = 'fuzzy=' + false;
      var direction = 'direction=' + 'forward';
      var query = 'q=' + req.query.query;
      var qParams = [from, to, fuzzy, direction, query].join('&')

      var options = {
        host: 'tausdata.org',
        path: '/api/segment.json?' + qParams,
        method: 'GET',
        // https
        port: 443,
        headers: {
          accept: '*/*',
          Authorization: 'Basic ' + combined
        }
      }

      // TODO: handle TAUSdata API errors (first param of callbacks)
      getJSON(options,
        function(result) {
          var matches = result;
          // get data from the TAUS api, then send it in the callback
//      res.send(200, "User's TAUS data was updated");
          console.log('result from TAUS')
          console.log(matches)
          res.matches = matches;
          next();
        });

    }
    // TODO: check if user has login credentials for this TM
    else {
      return next(new Error('error in API to TAUSdata'));
    }
    // retrieve the user from mongo, get the taus credentials, and call the taus api with the query
  });

}

// functions to filter the TM results
exports.tmFilter = function(req, res) {
  console.log('users.tmFilter fired');
  if (res) {
    res.send(200, "User's TAUS data was updated");
  } else {
    res.send(404, 'USER_NOT_FOUND')
  }
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
