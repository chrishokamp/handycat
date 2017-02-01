var restify = require('restify');
var xliffCreator = require('./node_modules/node-xliff/xliffCreator');

var server = restify.createServer({
  name: 'xliff-creator-server',
  version: '0.0.1'
});
// deal with slashes at the end
server.pre(restify.pre.sanitizePath());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.CORS());
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/create-xliff/:spec', function (req, res, next) {
  var spec, sourceLang, targetLang, xliff;

  if (req.params.spec) {
    spec = req.params.spec;
  }

  req.params.sourceLang ? sourceLang = req.params.sourceLang : sourceLang = 'unknown';
  req.params.targetLang ? targetLang = req.params.targetLang : targetLang = 'unknown';

  if (!req.params.sourceText) {
    next(new Error('No sourceText on request'));
    return;
  }

  var sourceText = req.params.sourceText;

  if (spec && spec === '1.2') {
    xliff = xliffCreator.createXlf1FromSourceText(sourceLang, targetLang, xliffCreator.parsers.splitLines(sourceText));
  } else {
    xliff = xliffCreator.createXlf2FromSourceText(sourceLang, targetLang, xliffCreator.parsers.splitLines(sourceText));
  }

  res.send(xliff);
  return next();
});

server.get('/create-parallel-xliff/:spec', function (req, res, next) {
  var spec, sourceLang, targetLang, xliff;

  if (req.params.spec) {
    spec = req.params.spec;
  }

  req.params.sourceLang ? sourceLang = req.params.sourceLang : sourceLang = 'unknown';
  req.params.targetLang ? targetLang = req.params.targetLang : targetLang = 'unknown';

  if (!req.params.sourceText) {
    next(new Error('No sourceText on request'));
    return;
  }
  if (!req.params.targetText) {
    next(new Error('No targetText on request'));
    return;
  }

  var sourceText = req.params.sourceText;
  var targetText = req.params.targetText;

  var sourceLines = xliffCreator.parsers.splitLines(req.params.sourceText);
  var targetLines = xliffCreator.parsers.splitLines(req.params.targetText);
  // assert line counts are the same
  if (sourceLines.length !== targetLines.length) {
    next(new Error('Source and Target texts do not have the same number of lines'));
    return;
  }

  if (spec && spec === '1.2') {
    xliff = xliffCreator.createXlf1FromSourceAndTargetText(sourceLang, targetLang, sourceLines, targetLines);
  } else {
    xliff = xliffCreator.createXlf2FromSourceAndTargetText(sourceLang, targetLang, sourceLines, targetLines);
  }

  res.send(xliff);
  return next();
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});

