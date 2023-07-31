// import required modules
const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const Filter = require("bad-words");
const {
    generateMessage,
    generateLocationMessage,
} = require("./utils/messages");

const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
} = require("./utils/users");

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

    socket.on("join", ({ username, roomname }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, roomname });
        if (error) {
            return callback(error);
        }

        socket.join(user.roomname);
        socket.emit(
            "message",
            generateMessage("Admin", "Welcome to the chat room!!.")
        );

        // when a new user joins the chat
        socket.broadcast
            .to(user.roomname)
            .emit(
                "message",
                generateMessage(
                    "Admin",
                    `${user.username} has joined the chat!!.`
                )
            );

        callback();
    });

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);
        const filter = new Filter();
        if (filter.isProfane(message)) {
            return callback("Profanity is not allowed");
        }
        io.to(user.roomname).emit(
            "message",
            generateMessage(user.username, message)
        );
        callback();
    });

    // when an user leaves the chat
    socket.on("disconnect", () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.roomname).emit(
                "message",
                generateMessage(
                    "Admin",
                    `${user.username} has left the chat!!.`
                )
            );
        }
    });

    // sends location to all the users
    socket.on("sendLocation", (location, callback) => {
        const user = getUser(socket.id);
        io.to(user.roomname).emit(
            "locationMessage",
            generateLocationMessage(
                user.username,
                `https://google.com/maps?q=${location.latitude},${location.longitude}`
            )
        );
        callback();
    });
});

server.listen(port, () => {
    console.log("listening on port " + port);
});
