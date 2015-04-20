var http = require("http");
var https = require("https");

/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.getJSON = function(options, onResult, res)
{
    console.log("rest::getJSON");
  // TODO: trying to pass error back to client

    var prot = options.port == 443 ? https : http;
	var req = prot.request(options, function(jsonRes)
    {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        jsonRes.setEncoding('utf8');

        jsonRes.on('data', function (chunk) {
            output += chunk;
        });

      jsonRes.on('error', function(err) {
        console.log('error from getJSON:');
        console.log(err.message);
        res.status(404);
        res.send();
        onResult(err, {});
      });

        jsonRes.on('end', function() {
            var obj = JSON.parse(output);
            onResult(err, obj);
        });
    });

  req.on('error', function(err) {
    // res.send('error: ' + err.message);
    console.log('error from getJSON:');
    console.log(err.message);
    res.status(404);
    res.send();
    onResult(err, {});
  });

    req.end();
};


