// Make connection
var urlParams = new URLSearchParams(window.location.search);
var getID = urlParams.get('ID');
var getUserName = urlParams.get('Name');
let socket = io.connect('https://chatserverforapps.herokuapp.com/');
socket.on('connect', function (data) {
    var CustomerID = getID;
    var UserName = getUserName
    console.log(CustomerID);
    socket.emit('storeClientInfo', {
        customId: CustomerID,
        username: UserName
    });
});
// Query DOM
var message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    GetID = document.getElementById('GetID');
AddID = document.getElementById('AddID');
ShowTheFirst = document.getElementById('ShowTheFirst');
DontShowFirst = document.getElementById('DontShowFirst');
CustomerID1111 = document.getElementById('CustomerID'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback');
// Emit events
btn.addEventListener('click', function () {
    socket.emit('chat', {
        message: message.value,
        handle: getUserName,
        customId: ClickedID,
        MyID: getID
    });

    output.innerHTML += '<div id="YourMsg">' + message.value + '</div>';
    message.value = "";
});
message.addEventListener('keypress', function () {
    socket.emit('typing', {
        TyperName: getUserName,
        customId: ClickedID,
        MyID: getID
    });
})

// CustomerID1111.addEventListener('blur', function () {
//     socket.emit('isActive', CustomerID1111.value)
// })

// Listen for events
socket.on('chat', function (data) {
    if (data.MyID == ClickedID) {
        feedback.innerHTML = '';
        output.innerHTML += ' <div id="OthersMsg">' + data.message + '</div>';
    }
});

socket.on('typing', function (data) {
    if (data.MyID == ClickedID) {
        feedback.innerHTML = '<p><em>' + data.TyperName + ' is typing a message...</em></p>';
    }
});

var ClickedID;
var ClickedName;

function OpenChatAccording(item, index) {
    $('#output').empty();
    $('#feedback').empty();
    ClickedID = item;
    ClickedName = $('.oneoneuser' + index + '').attr('data-UserName');
    $('#UserNameShoe').text(ClickedName);
    $('#myModal').modal('show');
    socket.emit('isActive', ClickedID)
}
GEtAllUsers();

function GEtAllUsers() {
    socket.emit('GetOnlineUsers', '');
}
socket.on('GetOnlineUsers', function (data) {
    console.log(data);
    var tr = '';
    if (data.length != 0) {
        $.each(data, function (index, item) {
            if (item.customId != getID) {
                tr += '<div id="oneoneuser" class="oneoneuser' + index + '" data-UserName=' + item.UserName + ' onclick="OpenChatAccording(' + item.customId + ',' + index + ')">';
                tr += '<h6><span id="YourOnline">' + index + '</span>&nbsp;&nbsp;&nbsp;&nbsp;' + item.UserName + '</h6>'
                tr += ' </div>';
            }
        })
    } else {
        tr += '<div style="color:red">No Users In Online</div>';
    }
    $('#ChatShowDiv').empty().append(tr);
})

socket.on('onIsActive', function (data) {
    if (ClickedID = data.UserID) {
        if (data.isActive == true) {
            $('#ShowWhenColor').text('Online');
            $('#ShowWhenColor').css('color', 'green');
        } else {
            $('#ShowWhenColor').text('Offline');
            $('#ShowWhenColor').css('color', 'red');
        }
    }
})