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

io.on('connection', (socket) => {
    console.log("New websocket connection");
});

server.listen(port, () => {
    console.log('listening on port ' + port);
});