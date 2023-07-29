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

// get the elements using query selector
const $messageForm = document.querySelector("#form-message");
const $messageFormInput = document.querySelector("input");
const $messageFormButton = document.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// get the template from query selector
const $messageTemplate = document.querySelector("#message-template").innerHTML;
const $locationMessageTemplate = document.querySelector(
    "#location-message-template"
).innerHTML;

const { username, roomname } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

socket.on("message", (message) => {
    console.log(message);
    const html_value = Mustache.render($messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a"),
    });
    $messages.insertAdjacentHTML("beforeend", html_value);
});

// listen for location message
socket.on("locationMessage", (message) => {
    console.log(message);
    const html_value = Mustache.render($locationMessageTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format("h:mm a"),
    });
    $messages.insertAdjacentHTML("beforeend", html_value);
});

$messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    $messageFormButton.setAttribute("disabled", "disabled");

    const message = event.target.elements.message.value;
    socket.emit("sendMessage", message, (error) => {
        $messageFormButton.removeAttribute("disabled");
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

// emit an action when user joins a chat
socket.emit("join", { username, roomname });
