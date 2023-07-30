const users = [];

const addUser = ({ id, username, roomname }) => {
    username = username.trim().toLowerCase();
    roomname = roomname.trim().toLowerCase();

    // validate username and roomname are not empty
    if (!username || !roomname) {
        return {
            error: "username and roomname are required",
        };
    }

    // check whether username already taken or not
    const isUserExist = users.find((user) => {
        return user.username === username && user.roomname === roomname;
    });

    if (isUserExist) {
        return {
            error: "username already taken",
        };
    }

    const user = { id, username, roomname };
    users.push(user);
    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getUser = (id) => {
    return users.find((user) => user.id === id);
};

const getUsersInRoom = (roomname) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => user.roomname === roomname);
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
};
