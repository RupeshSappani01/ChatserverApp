var express = require('express');
var socket = require('socket.io');
var bodyParser = require('body-parser');
var guidgenerator = require('../src/config/guidgenerator');
var DatabaseSend = require('../src/config/database');
// App setup
var app = express();
var server = app.listen(process.env.PORT || 4000, function () {
    console.log('listening for requests on port', process.env.PORT || 4000);
});
var clients = [];
var givingArray = [];
var DocumentsList = [];
var CheckUserOnlineID = "";

// Static files
app.use(express.static('public'));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}))

// parse requests of content-type - application/json
app.use(bodyParser.json())
// Socket setup & pass server
var io = socket(server, {
    'pingTimeout': 2000,
    'pingInterval': 2500
});
//Server For Register
const nsp1 = io.of("/Chat");
const nsp = io.of('/Register');
const nsp2 = io.of("/RefreshBrowser");
nsp.on('connection', (socket) => {
    console.log("connected", socket.id);
    socket.on("RegistedSuccess", function (data) {
        console.log("Got The Message", data);
        socket.broadcast.emit("RegistedSuccess", data);
    })
})
nsp2.on('connection', (socket) => {
    socket.on("RefreshTheBrowser", function (data) {
        socket.broadcast.emit("RefreshTheBrowser", data);
    })
})
//Server For Chat
nsp1.on('connection', (socket) => {
    console.log('made socket connection', socket.id);
    socket.on('storeClientInfo', function (data) {
        let response;
        response = {
            UserID: data.customId,
            isActive: true
        };
        socket.broadcast.emit('onIsActive', response)
        console.log('CustomerID', data);
        var clientInfo = new Object();
        clientInfo.customId = data.customId;
        clientInfo.clientId = socket.id;
        clientInfo.UserName = data.username;
        clients.push(clientInfo);
        console.log(clients);
        // for (var i = 0, len = clients.length; i < len; ++i) {
        //     if(clients[i].customId==data.customId){
        //         clients.splice(i,1);
        //     }
        // }       
        //  socket.broadcast.emit('GetOnlineUsers', clients);
    });
    //Check User Online Status
    socket.on('isActive', function (userId) {
        console.log("isActive", userId)
        var UserID = userId;
        var user = null;
        for (var i = 0, len = clients.length; i < len; ++i) {
            var c = clients[i];
            if (c.customId == UserID) {
                user = c.clientId;
                break;
            } else {
                user = null;
            }
        }
        const socketId = socket.id;
        let response;
        if (user) {
            // User is active
            response = {
                UserID: userId,
                isActive: true
            };
        } else {
            // User is not active
            response = {
                UserID: userId,
                isActive: false
            };
        }
        const responseSocket = io.sockets.connected[socketId];
        if (responseSocket) {
            //console.log(response)
            responseSocket.emit('onIsActive', response);
        }
    });
    // Handle chat event
    socket.on('chat', function (data) {

        console.log(data);
        clients.forEach(function (item, index) {
            if (item.customId == data.customId) {
                // console.log(item.clientId);
                socket.broadcast.to(item.clientId).emit('chat', data);
            }
        })
    });
    //online Users Get
    socket.on('GetOnlineUsers', function (data) {
        socket.emit('GetOnlineUsers', clients);
    })
    //all users Online Status Checker
    socket.on('UsersAllOnlineStatus', function (data) {
        givingArray.splice(0, givingArray.length);
        debugger;
        console.log("aaaaaaaaaaaaa", data);
        // var addd=JSON.parse(data);
        // console.log("bbbbbbbbbbbb",addd);

        var clientInfo1 = new Object();
        var user = null;
        for (var j = 0, len1 = data.length; j < len1; ++j) {
            let alreadyChecked = "";
            for (var i = 0, len = clients.length; i < len; ++i) {
                var c = clients[i];
                var d = data[j];
                console.log('ddddddddddddddddddd', d);
                if (alreadyChecked == d) {
                    if (c.customId == d) {
                        alreadyChecked = d;
                        clientInfo1.UserID = d;
                        clientInfo1.Status = true;
                    } else {
                        clientInfo1.UserID = d;
                        clientInfo1.Status = false;
                    }
                    givingArray.push(clientInfo1);
                } else {
                    continue;
                }
            }
        }
        console.log("bbbbbbbb", givingArray);

        socket.broadcast.emit('UsersAllOnlineStatus', givingArray);

    })
    // Handle typing event
    socket.on('typing', function (data) {
        clients.forEach(function (item, index) {
            if (item.customId == data.customId) {
                // console.log(item.clientId);
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
                let response;
                response = {
                    UserID: c.customId,
                    isActive: false
                };
                socket.broadcast.emit('onIsActive', response)
                socket.broadcast.emit('GetOnlineUsers', clients);
                break;
            }
        }
        console.log('DisconectedAfetr', clients);
    });

});

app.post('/api/SendChatMsg', (req, res) => {
    var chatobj = {
        ChatID: guidgenerator(),
        SendFrom: req.body.SendFrom,
        SendTo: req.body.SendTo,
        ChatText: req.body.ChatText,
        SentDate: req.body.SentDate
    }
    return DatabaseSend(chatobj, res);
});

// var express = require('express');
// var socket = require('socket.io');

// // App setup
// var app = express();
// var server = app.listen(process.env.PORT || 4000, function () {
//     console.log('listening for requests on port',process.env.PORT);
// });
// var clients = [];
// var CheckUserOnlineID="";
// // Static files
// app.use(express.static('public'));
// // Socket setup & pass server
// var io = socket(server);
// io.on('connection', (socket) => {
//     //console.log('made socket connection', socket.id);
//     socket.on('storeClientInfo', function (data) {
//         console.log('CustomerID', data);
//         var clientInfo = new Object();
//         clientInfo.customId = data.customId;
//         clientInfo.clientId = socket.id;
//         clientInfo.UserName=data.username;
//         clients.push(clientInfo);
//         console.log(clients);
//     });
// //Check User Online Status

//     // Handle chat event
//     socket.on('chat', function (data) {
//         console.log(data);

//         clients.forEach(function (item, index) {
//             if (item.customId == data.customId) {
//                 console.log(item.clientId);
//                 socket.broadcast.to(item.clientId).emit('chat', data);
//             }
//         })



//     });

//     // Handle typing event
//     socket.on('typing', function (data) {
//         clients.forEach(function (item, index) {
//             if (item.customId == data.customId) {
//                 console.log(item.clientId);
//                 socket.broadcast.to(item.clientId).emit('typing', data);
//             }
//         })

//     });
//     socket.on('disconnect', function (data) {
//         console.log("Disconnected ID", socket.id);
//         for (var i = 0, len = clients.length; i < len; ++i) {
//             var c = clients[i];

//             if (c.clientId == socket.id) {
//                 clients.splice(i, 1);
//                 break;
//             }
//         }
//     console.log(clients);
//     });

// });
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