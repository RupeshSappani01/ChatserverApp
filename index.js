var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(process.env.PORT || 4000, function () {
    console.log('listening for requests on port',process.env.PORT);
});
var clients = [];
// Static files
app.use(express.static('public'));
// Socket setup & pass server
var io = socket(server);
io.on('connection', (socket) => {
    //console.log('made socket connection', socket.id);
    socket.on('storeClientInfo', function (data) {
        console.log('CustomerID', data);
        var clientInfo = new Object();
        clientInfo.customId = data.customId;
        clientInfo.clientId = socket.id;
        clients.push(clientInfo);
        console.log(clients);
    });

    // Handle chat event
    socket.on('chat', function (data) {
        console.log(data);

        clients.forEach(function (item, index) {
            if (item.customId == data.customId) {
                console.log(item.clientId);
                socket.broadcast.to(item.clientId).emit('chat', data);
            }
        })



    });

    // Handle typing event
    socket.on('typing', function (data) {
        clients.forEach(function (item, index) {
            if (item.customId == data.customId) {
                console.log(item.clientId);
                socket.broadcast.to(item.clientId).emit('typing', data);
            }
        })

    });
    socket.on('disconnect', function (data) {
        console.log("Disconnected ID", socket.id);
        for (var i = 0, len = clients.length; i < len; ++i) {
            var c = clients[i];

            if (c.clientId == socket.id) {
                clients.splice(i, 1);
                break;
            }
        }
    console.log(clients);
    });

});
// var express = require('express');
// var socket = require('socket.io');

// // App setup
// var app = express();
// var server = app.listen(process.env.PORT||4000, function(){
//     console.log('listening for requests on port 4000,');
// });

// // Static files
// app.use(express.static('public'));

// // Socket setup & pass server
// var io = socket(server);
// io.on('connection', (socket) => {

//     console.log('made socket connection', socket.id);

//     // Handle chat event
//     socket.on('chat', function(data){
//         console.log(data);
//         io.sockets.emit('chat', data);
//     });

//     // Handle typing event
//     socket.on('typing', function(data){
//         socket.broadcast.emit('typing', data);
//     });

// });