// import required modules
const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;

// serve static files from the public directory
app.use(express.static(path.join(__dirname, "../public")));

let count = 0;

io.on("connection", (socket) => {
    console.log("New websocket connection");

    // emit an action on new connection to client
    // socket.emit('countUpdated', count);

    // listen to emit action from the client
    // socket.on('increment', () => {
    //     count = count + 1;

    //     // will update only the client which performed click operation
    //     // socket.emit('countUpdated', count);

    //     // will update all the clients
    //     io.emit('countUpdated', count);
    // });

    socket.emit("message", "Welcome!!");

    // when a new user joins the chat
    socket.broadcast.emit("message", "A user has joined the chat");

    socket.on("sendMessage", (message) => {
        io.emit("message", message);
    });

    // when an user leaves the chat
    socket.on("disconnect", () => {
        io.emit("message", "A user has left the chat");
    });

    // sends location to all the users
    socket.on("sendLocation", (location) => {
        io.emit(
            "message",
            `https://google.com/maps?q=${location.latitude},${location.longitude}`
        );
    });
});

server.listen(port, () => {
    console.log("listening on port " + port);
});
