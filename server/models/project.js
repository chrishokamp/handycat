'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  name: {
    type: String,
    index: true,
    required: true
  },
  // the xml content of the xliff file
  content: {
    type: String,
    default: ''
  },
  // the state of the project - TODO: add metadata about the user's position in the  and performance
  // TODO: the state of the project can be determined programatically from the XLIFF's contents, this is the correct way to check
  state: {
    type: String,
    default: '',
    trim: true
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true
  },
  created: Date,
  updated: [Date],
  creator: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

/**
 * Pre hook.
 */
ProjectSchema.pre('save', function(next, done){
  if (this.isNew)
    this.created = Date.now();

  this.updated.push(Date.now());

  next();
});

/**
 * Statics
 */
ProjectSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).populate('creator', 'username').exec(cb);
  }
};

/**
 * Methods
 */
ProjectSchema.statics.findByTitle = function (name, callback) {
  return this.find({ name: name }, callback);
}

ProjectSchema.methods.expressiveQuery = function (creator, date, callback) {
  return this.find('creator', creator).where('date').gte(date).run(callback);
}

/**
 * Plugins
 */

function slugGenerator (options){
  options = options || {};
  var key = options.key || 'name';

  return function slugGenerator(schema){
    schema.path(key).set(function(v){
      this.slug = v.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/-+/g, '');
      return v;
    });
  };
};

ProjectSchema.plugin(slugGenerator());

/**
 * Define model.
 */
mongoose.model('Project', ProjectSchema);
