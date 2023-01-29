const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { serverClient: false });
const { addUser, getUsersInRoom, userLeft, removeRooms, currentUser, rooms } = require('./public/home');

app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.on('createOrJoinRoom', ({ username, room, val}, cb) => {
        if(!rooms.includes(room) && val === 'tr') {
            cb("Invalid room id");
        }
        const user = addUser(socket.id, username, room);
        socket.join(user.room);
        const presentUsers = getUsersInRoom(user.room);
        io.to(user.room).emit('presentUsers', presentUsers);

        socket.on('message', (data) => {
            if(data) curr_user = currentUser(data.socket_id).room;
            if (getUsersInRoom(curr_user).length >= 2) {
                io.to(user.room).emit('showmessage', data);
            } else {
                socket.emit('usererror', "More than one person required in room to share images");
            }
        });
    });

    socket.on('disconnect', () => {
        const user = userLeft(socket.id);
        if (user) {
            const presentUsers = getUsersInRoom(user.room);
            io.to(user.room).emit('presentUsers', presentUsers);
            if (getUsersInRoom(user.room).length === 0) {
                removeRooms(user.room);
            }
        }
    });
});


server.listen(process.env.PORT || 3000, () => {
    console.log('Server Running...')
})