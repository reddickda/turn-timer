const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"]
  }
});

// user connects
// user attempts to join
// if no id is passed, its a hosted room with users id
// if id is passed, its a join with passed id
io.on('connection', (socket) => {
  if (socket.recovered) {
    // any missed packets will be received
    console.log("recovered")
  } else {
    console.log("not recovered")
    // new or unrecoverable session
  }
  console.log('a user connected', socket.id);
  socket.on('host', async () => {
    socket.join(socket.id);
    const sockets = await io.in(socket.id).fetchSockets();

    const usernames = sockets.map((socket) => {
      return socket.handshake.auth.value;
    })

    io.to(socket.id)
      .emit('connectedUsers', {
        users: usernames
      })
  });

  socket.on('join', async ({ name, roomNum }, callback) => {
    const roomNumber = roomNum;
    const exists = io.sockets.adapter.rooms.get(roomNumber)
    if (!exists) {
      callback({
        status: "no-room"
      });
      return;
    }

    callback({
      status: "ok"
    });
    socket.join(roomNumber)
    console.log('joined a room', roomNumber)

    // var clients = io.sockets.adapter.rooms.get(roomNumber);
    // console.log('users in room', clients)

    const sockets = await io.in(roomNumber).fetchSockets();

    const usernames = sockets.map((socket) => {
      return socket.handshake.auth.value;
    })


    io.to(roomNumber)
      .emit('connectedUsers', {
        users: usernames
      })
  });

  socket.on('leave', async ({ name, roomNum }, callback) => {
    console.log(`player ${socket.id} left room ${roomNum}`)

    const roomNumber = roomNum ?? socket.id;

    socket.leave(roomNumber)

    socket.to(roomNumber).emit('leftGame', { room: roomNumber, id: socket.id, name: socket.handshake.auth.value })

    const sockets = await io.in(roomNumber).fetchSockets();

    const usernames = sockets.map((socket) => {
      return socket.handshake.auth.value;
    })

    console.log("remaining", usernames)


    io.to(roomNumber)
      .emit('connectedUsers', {
        users: usernames
      })
  })

  socket.on('startGame', async ({ name, roomNum, players }, callback) => {
    console.log('host started game');
    const roomNumber = roomNum ?? socket.id;

    console.log('roomnum', roomNumber)

    const sockets = await io.in(roomNumber).fetchSockets();

    const usernames = sockets.map((socket) => {
      return socket.handshake.auth.value;
    })

    console.log("players... ",players)

    io.to(roomNumber).emit('startedGame', { room: roomNumber, players: players })

    io.to(roomNumber).emit('myTurn', { name: players[0], roomNum: roomNumber})
    // io.sockets.in(roomNumber).emit('startedGame', { room: roomNumber });
    // socket.broadcast.to(roomNumber).emit('startedGame', { room: roomNumber }); // This will emit the event to all connected sockets
  })

  socket.on('endGame', ({ name, roomNum }, callback) => {
    console.log('host ended game');
    io.to(roomNum).emit('endedGame', { room: roomNum }); // This will emit the event to all connected sockets
  });

  socket.on('endedTurn', ({ name, roomNum }, callback) => {
    console.log('user ended turn');
    io.emit('endedTurn', { user: socket.id }); // This will emit the event to all connected sockets
  });

  socket.on('nextTurn', ({name, roomNum}) => {
    console.log(`${name}'s turn!`);

    io.to(roomNum).emit('myTurn', { name: name })
  })

  socket.on('timerUp', ({ name, roomNum }, callback) => {

  });

  socket.on('configure', ({ name, roomNum }, callback) => {

  });

  socket.on('disconnect', ({ name, roomNum }, callback) => {
    console.log('user disconnected', socket.id);

    socket.leave(roomNum)
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});