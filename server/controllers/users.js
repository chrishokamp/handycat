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
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load user ' + id));
    req.user = user;
    next();
  });
};

/**
 * Update a user's data
 */
exports.update = function(req, res) {
  var user = req.user;
  var id = user._id;

  var tausUsername = req.body.tausUsername;
  var tausPassword = req.body.tausPassword;
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
 * Delete a user
 */
exports.destroy = function(req, res) {
  var user = req.user;

  user.remove(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(user);
    }
  });
};

// API TO TRANSLATION RESOURCES

// (1) User queries TM
// (2) we get responses from all of this user's resources
// (3) we order those responses by some criteria
// (4) we return the ordered list to the UI
// (5) add an optional 'filter' param to only check certain resources (?)

// put all of this user's source-->target resources onto the req
//exports.addUserResources

// a user's tm is stored in their mongo database, and it grows over time
// each user has one or more graph tms -- see resource.js for the implementation

// WORKING - generalize resource setup so that different resources can use the same interface
// A user possesses translation resources that map from source --> target
// the server provides mappings which convert the HandyCAT internal API to the resource's end API
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

// check the user's translation memory cache to see if we've translated this segment before
exports.checkTMCache = function(req, res, next) {
  console.log('users.checkTMCache');
// mock data
  var sampleRes = {"provider":{"name":"Lingua Custodia","id":10635},"owner":{"name":"ECB","id":10975},"source":"Based on the reference amount of 4 million euro for the period 2002-2005 and 1 million euro for 2006, the annual appropriations authorised under the Pericles programme, were Euros 1.2 million for 2002; Euros 0.9 million for 2003;","industry":{"name":"Financials","id":12},"source_lang":{"name":"English (United States)","id":"en-us"},"target":"Sur la base du montant de référence de 4 millions d ' euros pour la période 2002-2005 et d ' un million d ' euros pour 2006, les crédits annuels autorisés dans le cadre du programme Pericles étaient de 1,2 millions d ' euros pour 2002, 0,9 million d ' euros pour 2003, 0,9 million d ' euros pour 2004, 1 million d ' euros pour 2005 et 1 million d ' euros pour 2006.","content_type":{"name":"Financial Documentation","id":10},"product":{"name":"Default","id":12512},"id":"en-us_fr-fr_11128729","target_lang":{"name":"French (France)","id":"fr-fr"}}
  var userId = req.params.userId;
  res.status(200).json(sampleRes);
  //next();
}

var getJSON = require('../getJSON').getJSON;
exports.queryTM = function (req, res, next) {
  //console.log('inside queryTM');

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

// functions to filter, rank, sort the TM results
exports.tmFilter = function(req, res) {
  console.log('users.tmFilter fired');
  if (res) {
    res.send(400, "NOT IMPLEMENTED");
  } else {
    res.send(404, 'USER_NOT_FOUND')
  }
}

