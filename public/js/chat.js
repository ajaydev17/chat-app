const socket = io();

// listen to event from the server
socket.on('countUpdated', (count) => {
    console.log("The value of the count has been updated!!", count);
});

// listen on click event on the button
document.querySelector("#increment").addEventListener('click', (event) => {
    // update the count and send back to server
    console.log("clicked");
    socket.emit('increment');
});
