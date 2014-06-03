
var  mongo = require('mongodb'),
  MongoClient = require('mongodb').MongoClient;
//  ObjectID = require('mongodb').ObjectID,
//  BSON = require('mongodb').pure().BSON,
//  assert = require('assert');

//MongoClient.connect('mongodb://127.0.0.1:27017/dynamic_tm',
//  function(err, db) {
//    if(!err) {
//      console.log('connected');
//      collection = db.collection('dbpedia_entities');
//      collection.count(function(err,count) {
//          console.log("count: " + count)
//      });
//    }
//  }
//);

// samples from Wine app
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('127.0.0.1', 27017, {auto_reconnect: true});
db = new Db('dynamic_tm', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'dynamic_tm' database");
        db.collection('dbpedia_entities', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'dbpedia_entities' collection doesn't exist. Creating it with sample data...");
            }
        });
    }
});

exports.findSurfaceFormByEntityName = function(req, res) {
  var lang = req.params.lang.toString().trim();
  var entityName = req.params.entity.toString().trim();

  console.log('Retrieving entity: ' + entityName);
  db.collection('dbpedia_entities', function(err, collection) {
      collection.findOne({ 'name': entityName }, function(err, item) {
        console.log('found item:');
        console.log(item);
        // TODO: the datastructure should be ['de']['surface_forms'] in mongo
        res.send(item['surface_forms']);
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

