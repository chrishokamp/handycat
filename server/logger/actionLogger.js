// Provides the interface to mongodb for logging
// Author: chrishokamp

var  mongo = require('mongodb'),
MongoClient = require('mongodb').MongoClient;
//  ObjectID = require('mongodb').ObjectID,
//  BSON = require('mongodb').pure().BSON,
//  assert = require('assert');

var Server = mongo.Server,
  Db = mongo.Db,
  BSON = mongo.BSONPure;

var server = new Server('127.0.0.1', 27017, {auto_reconnect: true});
db = new Db('session_logs', server);

db.open(function(err, db) {
  if(!err) {
    console.log("Connected to 'session_logs' database");
    db.collection('sessions', {strict:true}, function(err, collection) {
      if (err) {
        console.log("The 'sessions_logs' collection doesn't exist.");
      }
    });
  }
});

exports.addEntryToSession = function(req, res) {
  console.log(req.body);
  // The session MUST already exist
  var sessionId = req.body.sessionid.toString().trim();
  var logEntry = req.body.logentry.toString().trim();

  db.collection('sessions', function(err, collection) {
    collection.findOne({ 'sessionId': Number(sessionId) }, function(err, item) {
      console.log('found item:');
      console.log(item);
//      if(item) {
//        res.send(item['surface_forms']);
//      } else {
//        res.send([[entityName, 1]]);
//
//      }
      res.send('test');
    });
  });
};

//exports.findbyid = function(req, res) {
//    var id = req.params.id;
//    console.log('Retrieving wine: ' + id);
//    db.collection('wines', function(err, collection) {
//        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
//            res.send(item);
//        });

//    });
//};
//exports.findAll = function(req, res) {
//    db.collection('wines', function(err, collection) {
//        collection.find().toArray(function(err, items) {
//            res.send(items);
//        });
//    });
//};