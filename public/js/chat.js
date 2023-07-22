const socket = io();

// listen to event from the server
// socket.on('countUpdated', (count) => {
//     console.log("The value of the count has been updated!!", count);
// });

// listen on click event on the button
// document.querySelector("#increment").addEventListener('click', (event) => {
//     // update the count and send back to server
//     console.log("clicked");
//     socket.emit('increment');
// });

socket.on("message", (message) => {
    console.log(message);
});

document.querySelector("#form-message").addEventListener("submit", (event) => {
    event.preventDefault();

    const message = event.target.elements.message.value;
    socket.emit("sendMessage", message, (message) => {
        console.log("The message has been delivered successfully!!", message);
    });
});

document.querySelector("#send-location").addEventListener("click", (event) => {
    if (!navigator.geolocation) {
        return alert("geolocation not supported by your browser!!");
    }
    navigator.geolocation.getCurrentPosition((position) => {
        // sends location to the server
        socket.emit("sendLocation", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        });
    });
});
