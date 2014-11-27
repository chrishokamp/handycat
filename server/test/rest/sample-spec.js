var request = require('supertest')
  , express = require('express')
, http = require('http');

var app = express();
var server;

app.get('/', function(req, res){
  res.status(200).json({ name: 'party' });
});

app.get('/user', function(req, res){
  res.status(200).json({ name: 'toto' });
});

beforeEach(function(done) {
  server = http.createServer(app).listen(process.env.PORT || 5002);
  done();
});

afterEach(function(done) {
server.close();
  done();
});

describe('GET /user', function(){
  it('should respond with json', function(done){
    request(app)
      .get('/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, done);
  });
  xit('should return a json value in the body', function(done) {
    console.log('T2');
    request(app)
      .get('/')
      .expect(function(res) {
        console.log('RETURN VAL FUNC:');
        console.log('res');
        console.log(res);
        return true;

      });
      //.expect(returnVal)
      //.get('/').expect(200, function(err){
      //  console.log(err);
      //})
    //function returnVal(res) {
    //  console.log('RETURN VAL FUNC:');
    //  console.log('res');
    //  console.log(res);
    //  //var returnVal = res.param('name');
    //  return true;
    //}


    //request.get('http://localhost:5002').expect('heya', function(err){
    //  console.log(err);
    //});


  });

});
