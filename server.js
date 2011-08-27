// server.js 
var http = require('http') 
, nko = require('nko')('Hxtrx6gzbN0UJ876');

var app = http.createServer(function (req, res) { 
res.writeHead(200, { 'Content-Type': 'text/html' }); 
res.end('Hello, World'); 
});

app.listen(parseInt(process.env.PORT) || 7777); 
console.log('Listening on ' + app.address().port);
