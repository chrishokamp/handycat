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
// TODO: set db name from config
var db = new Db('handycat_logs', server);

db.open(function(err, db) {
  if(!err) {
    console.log("Connected to 'handycat_logs' database");
    db.collection('session_logs', {strict:true}, function(err, collection) {
      if (err) {
        console.log("The 'session_logs' collection doesn't exist. Creating it...");
      }
    });
  }
});

exports.logAction = function(req, res) {
  var logEntry = req.body.logAction;

  // insert a new log entry
  db.collection('session_logs', function(err, collection) {
    collection.insert(logEntry, function(err, insertedObj) {
      if (err) {
        console.error('error: inserting log entry')
        console.error(err);
      }
      res.send(200);
    });
  });
};
