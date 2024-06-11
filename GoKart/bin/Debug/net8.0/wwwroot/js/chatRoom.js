"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatRoomHub").build();

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

connection.on("JoinedRoom", function (user, roomName) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${user} Has joined room: ${roomName}!`;
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
})
    .catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var roomName = parseInt(document.getElementById("roomInput").value);
    connection.invoke("JoinRoom", roomName).catch(function (err) {

        //console.error(err.toString());
        var p = document.createElement("p");
        document.getElementById("messagesList").appendChild(p);
        //p.textContent = `Error: ${message}`;
        p.textContent = `${err}`;

    });
    event.preventDefault();
});