var StaticServer = require('node-static').Server;
var dateselect = require('./lib/dateselect')

//
// Create a node-static server instance to serve the './public' folder
//
var file = new StaticServer('./public');

var httpServer = require('http').createServer(function (request, response) {
    request.on('end', function () {
      //
      // Serve files!
      //
      file.serve(request, response);
    });
});

var io = require('socket.io').listen(httpServer);

io.configure(function () {
  // Best browser compability for now, I think. Latest chrome at least have some
  // issues with websockets.
  io.set('transports', ['xhr-polling']);
  io.set('log level', 0);
});

var port = process.env.PORT || 3000;
httpServer.listen(port, function(){
  console.log("Listening on " + port);
});

io.sockets.on('connection', function (socket) {
  socket.on("ping", function(selector){
    try{
      var next = dateselect.next(selector);
      socket.emit('pong', null, next.getTime());
    } catch(e){
      console.log(e);
      socket.emit('pong', e.toString());
    }
  })
});
