
var Db = require('mongodb').Db,
  MongoClient = require('mongodb').MongoClient,
//  ObjectID = require('mongodb').ObjectID,
//  BSON = require('mongodb').pure().BSON,
//  assert = require('assert');


MongoClient.connect('mongodb://127.0.0.1:27017/dynamic_tm',
  function(err, db) {
    if(!err) {
      console.log('connected');
      collection = db.collection('dbpedia_entities');
      collection.count(function(err,count) {
          console.log("count: " + count)
      });
    }
  }
);