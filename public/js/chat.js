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

const $messageForm = document.querySelector("#form-message");
const $messageFormInput = document.querySelector("input");
const $messageFormButton = document.querySelector("button");
const $sendLocationButton = docuemnt.querySelector("#send-location");

socket.on("message", (message) => {
    console.log(message);
});

$messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    $messageFormButton.setAttribute("disabled", "disabled");

    const message = event.target.elements.message.value;
    socket.emit("sendMessage", message, (error) => {
        $messageForm.removeAttribute("disabled");
        $messageFormInput.value = "";
        $messageFormInput.focus();
        if (error) {
            return console.log(error);
        }
        console.log("The message has been delivered successfully!!");
    });
});

$sendLocationButton.addEventListener("click", (event) => {
    if (!navigator.geolocation) {
        return alert("geolocation not supported by your browser!!");
    }

    $sendLocationButton.setAttribute("disabled", "disabled");

    navigator.geolocation.getCurrentPosition((position) => {
        // sends location to the server
        socket.emit(
            "sendLocation",
            {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            },
            () => {
                $sendLocationButton.removeAttribute("disabled");
                console.log("Location has been shared successfully!!");
            }
        );
    });
});
