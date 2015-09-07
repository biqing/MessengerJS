var u = require('url');
var fs = require('fs');

var http = require('http').createServer(function(req,res){
	var path = require('url').parse(req.url).pathname;
	if(req.method == 'GET'){
		switch(path){
			case '/':
				res.writeHead(200, {'Content-Type': 'text/html'});
				fs.readFile('./parent.html',function(err,data){
					res.end(data,'utf8');
				});
				break;
			case '/child.html':
				fs.readFile('./child.html',function(err,data){
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
}).listen(80);
console.log('serve open - locallhost:80');
