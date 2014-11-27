// TODO: server side tests should test logic
// load and register the schemas first
var fs = require('fs'),
    path = require('path');

var modelsPath = path.join(__dirname, '../../../models');
fs.readdirSync(modelsPath).forEach(function (file) {
    require(modelsPath + '/' + file);
});
var projects = require('../../../controllers/projects');

describe("project controller functionality", function () {
    it("can create a new project", function () {
      console.log('loaded projects');
          expect(product).toBe(6);
    });
});
