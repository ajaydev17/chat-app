// import required modules
const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;

// serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

let count = 0;

io.on('connection', (socket) => {
    console.log("New websocket connection");

    // emit an action on new connection to client
    socket.emit('countUpdated', count);

    // listen to emit action from the client
    socket.on('increment', () => {
        count = count + 1;

        // will update only the client which performed click operation
        // socket.emit('countUpdated', count);

        // will update all the clients
        io.emit('countUpdated', count);
    });
});

server.listen(port, () => {
    console.log('listening on port ' + port);
});