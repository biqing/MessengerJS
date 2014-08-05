var cp = require('child_process');
function server(){
  var child = cp.fork('./server/http.js');
  var child1 = cp.fork('./server/http1.js');
  var child1 = cp.fork('./server/http2.js');
}
module.exports = server;
