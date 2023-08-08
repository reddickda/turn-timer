const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://192.168.0.25:5173", "https://main.d2cp9f7wdzoqk6.amplifyapp.com"] 
  }
});

app.get("/.well-known/pki-validation/DA1C5493B50B30579A9EC593EAEC3B8D.txt", (req, res) => {
	res.send('A14F4FD3741B8287B3D123C19316499CACA34AE6B254E0DA6253A996D41DD393 comodoca.com b6615a67c87a098');
})

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
    const joinCode = socket.id.substring(0,5);
    socket.join(joinCode);
    const sockets = await io.in(joinCode).fetchSockets();

    const usernames = sockets.map((socket) => {
      return socket.handshake.auth.value;
    })

    io.to(joinCode)
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

    const roomNumber = roomNum ?? socket.id.substring(0,5);
    ;


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

    const roomNumber = roomNum ?? socket.id.substring(0,5);

    io.to(roomNumber).emit('hostLeftRoom', { room: roomNumber })

    io.to(roomNumber)
      .emit('connectedUsers', {
        users: []
      })

    socket.leave(roomNumber)
  })

  socket.on('startGame', async ({ name, roomNum, players, turnLength }, callback) => {
    console.log('host started game');
    const roomNumber = roomNum ?? socket.id.substring(0,5);

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