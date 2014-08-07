// Setup and configure the server
var express = require('express');
var http = require("http");

var app = express();

// Setup public dir for the http server
app.use(express.static(__dirname + '/public'));

var server = http.createServer(app).listen(8080, function(){
    console.log('Express server listening on port ' + 8080);
});

var io = require('socket.io').listen(server);

// Setup the rooms array and Room object
var rooms = [];
function Room(roomSocket, roomId){
    this.roomSockets = [];
    this.roomSockets.push(roomSocket);
    this.roomId = roomId;
    this.mobileSockets = [];
};

// Setup the listeners for connections 
io.sockets.on('connection', function (socket) {
    
    socket.on("connect room", function(roomID, fn){
        var roomIndex = null;
        // Check room existence
        for(var i = 0; i < rooms.length; i++){
            if(rooms[i].roomId == roomID)
                roomIndex = i;
        }
        
        // Push the socket the the existing room or create a new room
        if(roomIndex !== null){
            rooms[roomIndex].roomSockets.push(socket);
            fn({
                host: false
            });
        }
        else{
            rooms.push(new Room(socket, roomID));
            fn({
                host: true
            });
        }
    });
    
    // On a new device connection we add the socket to the game
    socket.on("connect mobile", function(data, fn){
        // Search for the existing room
        var roomIndex = null;
        for(var i = 0; i < rooms.length; i++){
            if(rooms[i].roomId == data.room){
                roomIndex = i;
            }
        }
        
        // If we have found the desktop, add the user
        // Or else we send back that there is no room
        if(roomIndex !== null){
            rooms[roomIndex].mobileSockets.push(socket);
            socket.roomIndex = roomIndex;
            
            // Send to the other players in the room that a new user has been add
            rooms[roomIndex].roomSockets.forEach(function(room){
                room.emit("new player", {
                    id: socket.id
                });
            });
            
            fn({registered: true, error: ""});
        }
        else{
            fn({registered: false, error: "No live desktop connection found"});
        }
    });
    
    socket.on("update paddles", function(data){
        
    });
    
    //Update the position
    socket.on("update movement", function(data){
        if(rooms[socket.roomIndex] !== undefined){
            rooms[socket.roomIndex].roomSockets.forEach(function(room){
                room.emit("update movement", {
                    playerId: socket.id,
                    ori: data
                });
            });
            
        }
    });
    
    //When a user disconnects
    socket.on("disconnect", function(){
        var destroyThis = null;

        var roomIndex = socket.roomIndex;
        if(rooms[roomIndex] !== undefined){
            for(var i in rooms[roomIndex].mobileSockets){
                if(rooms[roomIndex].mobileSockets[i].id == socket.id){
                    destroyThis = i;
                }
            }
            
            if(destroyThis !== null){
                rooms[roomIndex].mobileSockets.splice(destroyThis, 1);
            }
            
            rooms[roomIndex].roomSockets.forEach(function(room){
                room.emit('user removed', socket.id);
            });
        }
    });
});