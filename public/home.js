const users = [];
const rooms = [];

const addUser = (id, username, room) => {
    const user = { id, username, room };
    users.push(user);
    if (rooms.findIndex(rm => rm === room) === -1) {
        rooms.push(room);
    }
    return user;
}

const getUsersInRoom = (room) => {
    return users.filter(user => user.room === room);
}

const userLeft = (id) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1)
        return users.splice(index, 1)[0];
}

const removeRooms = (room) => {
    const index = rooms.findIndex(rm => rm === room);
    if (index !== -1) {
        rooms.splice(index, 1);
    }
}

const currentUser = (socket_id) => {
    return users.find(user => user.id === socket_id);
}

module.exports = {
    addUser,
    getUsersInRoom,
    userLeft,
    removeRooms,
    currentUser,
    rooms
};