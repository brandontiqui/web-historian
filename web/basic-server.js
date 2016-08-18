var http = require('http');
var handler = require('./request-handler');
var initialize = require('./initialize.js');

// Why do you think we have this here?
// HINT: It has to do with what's in .gitignore
initialize('./archives');

var port = 8080;
var ip = '127.0.0.1';

var methodDirectory = {
  'GET': handler.handleGet,  
  'POST': handler.handlePost, 
  'OPTIONS': handler.handleGet
}; 

var server = http.createServer(function(request, response) {
  methodDirectory[request.method](request, response);
});

if (module.parent) {
  module.exports = server;
} else {
  server.listen(port, ip);
  console.log('Listening on http://' + ip + ':' + port);
}

