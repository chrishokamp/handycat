var restify = require('restify');

// configure the locations of each language dataset
var vocabularyLists = {
  'es': require('./vocabulary_datasets/lists/spanish.vocabulary.list.json'),
  'de': require('./vocabulary_datasets/lists/german.vocabulary.list.json'),
  'fr': require('./vocabulary_datasets/lists/french.vocabulary.list.json'),
  'pt': require('./vocabulary_datasets/lists/portuguese.vocabulary.list.json')
}

var server = restify.createServer({
  name: 'vocabulary-list-server',
  version: '0.0.2'
});

// deal with slashes at the end
server.pre(restify.pre.sanitizePath());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.CORS());
server.use(restify.queryParser());
//server.use(restify.bodyParser());

server.get('/vocablist/:lang', function (req, res, next) {
  var lang, vocablist;

  if (!req.params.lang) {
    next(new Error('No sourceText on request'));
    return;
  }
  lang = req.params.lang;

  vocablist = vocabularyLists[lang];
  res.send(vocablist);
  return next();
});

server.listen(8082, function () {
  console.log('%s listening at %s', server.name, server.url);
});

