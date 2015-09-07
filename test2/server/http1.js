var u = require('url');
var fs = require('fs');

var http = require('http').createServer(function(req,res){
	var path = require('url').parse(req.url).pathname;
	if(req.method == 'GET'){
		switch(path){
			case '/':
				res.writeHead(200, {'Content-Type': 'text/html'});
				fs.readFile('./iframe1.html',function(err,data){
					res.end(data,'utf8');
				});
				break;
			case '/messenger.js':
				res.writeHead(200, {'Content-Type': 'application/x-javascript'});
				fs.readFile('./messenger.js',function(err,data){
					res.end(data,'utf8');
				});
				break;
			default:
				res.end('not path');
		}
	}
}).listen(8080);
