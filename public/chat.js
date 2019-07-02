
// Make connection
var socket = io.connect('https://chatserverforapps.herokuapp.com');
socket.on('connect', function (data) {
    var CustomerID= Math.floor(Math.random()*100);
    console.log(CustomerID);
    socket.emit('storeClientInfo', { customId:CustomerID });
});
// Query DOM
var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      CustomerID1111 = document.getElementById('CustomerID'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');

// Emit events
btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.value,
        customId:CustomerID1111.value
    });
    message.value = "";
});
message.addEventListener('keypress', function(){
    socket.emit('typing', handle.value);
})

// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
