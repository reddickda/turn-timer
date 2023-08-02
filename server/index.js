const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
// cors: {
  //   origin: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1/3000", "http://3.83.94.212/3000", "http://3.83.94.212"]
  // }
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


    io.to(roomNumber).emit('leftGame', { name: socket.handshake.auth.value })
    socket.leave(roomNumber)

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

  socket.on('hostLeave', async ({ name, roomNum }, callback) => {
    console.log(`host ${socket.id} left room ${roomNum}`)

    const roomNumber = roomNum ?? socket.id;

    io.to(roomNumber).emit('hostLeftRoom', { room: roomNumber })

    io.to(roomNumber)
      .emit('connectedUsers', {
        users: []
      })

    socket.leave(roomNumber)
  })

  socket.on('startGame', async ({ name, roomNum, players, turnLength }, callback) => {
    console.log('host started game');
    const roomNumber = roomNum ?? socket.id;

    console.log('roomnum', roomNumber)

    const sockets = await io.in(roomNumber).fetchSockets();

    const usernames = sockets.map((socket) => {
      return socket.handshake.auth.value;
    })

    console.log("players... ", players)

    io.to(roomNumber).emit('startedGame', { room: roomNumber, players: players, turnLength })

    io.to(roomNumber).emit('myTurn', { name: players[0], roomNum: roomNumber })
  })

  socket.on('endGame', ({ name, roomNum }, callback) => {
    console.log('host ended game');
    io.to(roomNum).emit('endedGame', { room: roomNum });
  });

  socket.on('nextTurn', ({ name, roomNum }) => {
    console.log(`${name}'s turn!`);

    io.to(roomNum).emit('myTurn', { name: name })
  })

  socket.on('disconnect', ({ name, roomNum }, callback) => {
    console.log('user disconnected', socket.id);

    socket.leave(roomNum)
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});