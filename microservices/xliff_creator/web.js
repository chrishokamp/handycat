var restify = require('restify');
var xliffCreator = require('./node_modules/node-xliff/xliffCreator');

var server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.CORS());
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/echo/:name', function (req, res, next) {
  // req.params

  var sourceLang = 'en-US';
  var targetLang = 'de-DE';
  var sourceText = 'This is sentence one. This is sentence two.';

  var xliff = xliffCreator.createXlf1FromSourceText(sourceLang, targetLang, xliffCreator.parsers.splitSentences(sourceText));

  res.send(xliff);
  return next();
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
