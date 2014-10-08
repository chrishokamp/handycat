// a user has resources, which represent a way to transform text from one language to another
// the backend of the resource may be different, but the client API should always be the same

'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// TODO: working - make the schema for a translation resource
// A resource is something that knows how to map from source --> target
var ResourceSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  created: Date,
  updated: [Date],
  // we get the resource creator from the middleware (resource.create is in controllers/)
  creator: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

/**
 * Pre hook.
 */
ResourceSchema.pre('save', function(next, done){
  if (this.isNew)
    this.created = Date.now();

  this.updated.push(Date.now());

  next();
});

/**
 * Statics
 */
ResourceSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).populate('creator', 'username').exec(cb);
  }
};

/**
 * Methods
 */
ResourceSchema.statics.findByName = function (title, callback) {
  return this.find({ name: title }, callback);
}

///**
// * Plugins
// */
//
//function slugGenerator (options){
//  options = options || {};
//  var key = options.key || 'title';
//
//  return function slugGenerator(schema){
//    schema.path(key).set(function(v){
//      this.slug = v.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/-+/g, '');
//      return v;
//    });
//  };
//};
//
//ProjectSchema.plugin(slugGenerator());

/**
 * Define model.
 */
mongoose.model('Resource', ResourceSchema);
