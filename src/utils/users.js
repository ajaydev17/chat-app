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
