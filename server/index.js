const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  },
  cors: {
    origin: ["http://localhost:5173", "http://192.168.0.25:5173", "https://main.d2cp9f7wdzoqk6.amplifyapp.com"]
  }
});

app.get("/.well-known/pki-validation/965F41EDD8C244B9347865556C207ACD.txt", (req, res) => {
  res.send('BDC03A52F78A01F5DD5F0B40963E3C295E95EDD8903ECBD3B28A85BED5589A2C\ncomodoca.com\nc771524edbb7b14');
})

io.on('connection', (socket) => {
  if (socket.recovered) {
    console.log("recovered")
  } else {
    console.log("not recovered")
  }

  socket.on('host', async () => {
    let joinCode = generate().toLocaleUpperCase();
    while (io.sockets.adapter.rooms.get(joinCode) !== undefined) {
      joinCode = generate().toLocaleUpperCase();
    }
    console.log("joincode", joinCode)
    socket.join(joinCode);
    const sockets = await io.in(joinCode).fetchSockets();

    const usernames = sockets.map((socket) => {
      return socket.handshake.auth.value;
    })

    io.to(joinCode)
      .emit('connectedUsers', {
        users: usernames,
      })
    io.to(joinCode)
      .emit('hosting', {
        roomCode: joinCode
      })
  });

  socket.on('join', async ({ name, roomNum }, callback) => {
    const roomNumber = roomNum.toLocaleUpperCase();
    console.log(roomNumber)
    console.log(io.sockets.adapter.rooms)
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

    const roomNumber = roomNum ?? socket.id.substring(0, 5);

    io.to(roomNumber).emit('leftGame', { name: socket.handshake.auth.value })
    socket.leave(roomNumber)

    const sockets = await io.in(roomNumber).fetchSockets();

    const usernames = sockets.map((socket) => {
      return socket.handshake.auth.value;
    })

    console.log("remaining", usernames, roomNumber)

    io.to(roomNumber)
      .emit('connectedUsers', {
        users: usernames
      })
  })

  socket.on('hostLeave', async ({ name, roomNum }, callback) => {
    console.log(`host ${socket.id} left room ${roomNum}`)

    const roomNumber = roomNum ?? socket.id.substring(0, 5);

    io.to(roomNumber).emit('hostLeftRoom', { room: roomNumber })

    io.to(roomNumber)
      .emit('connectedUsers', {
        users: []
      })

    socket.leave(roomNumber)
  })

  socket.on('startGame', async ({ name, roomNum, players, turnLength }, callback) => {
    console.log('host started game', roomNum);
    const roomNumber = roomNum ?? socket.id.substring(0, 5);

    console.log('roomnum', roomNumber)

    const sockets = await io.in(roomNumber).fetchSockets();

    const usernames = sockets.map((socket) => {
      return socket.handshake.auth.value;
    })

    console.log("players... ", players)

    io.to(roomNumber).emit('startedGame', { room: roomNumber, players: players, turnLength })

    io.to(roomNumber).emit('myTurn', { name: players[0], roomNum: roomNumber })
  })

  socket.on('confirmOrder', ({ roomNum, players }) => {
    io.to(roomNum)
      .emit('connectedUsers', {
        users: players
      })
  })

  socket.on('endGame', ({ host, roomNum }, callback) => {
    console.log('host ended game');
    io.to(roomNum).emit('endedGame', { room: roomNum, host: host });
  });

  socket.on('nextTurn', ({ name, roomNum }) => {
    console.log(`${name}'s turn!`);

    io.to(roomNum).emit('myTurn', { name: name })
  })

  socket.on('disconnecting', async () => {
    const [, roomNumber] = socket.rooms

    socket.leave(roomNumber)

    const sockets = await io.in(roomNumber).fetchSockets();

    const usernames = sockets.map((socket) => {
      return socket.handshake.auth.value;
    })

    console.log("remaining", usernames, roomNumber)

    io.to(roomNumber)
      .emit('connectedUsers', {
        users: usernames
      })

    io.to(roomNumber).emit('endedGame', { room: roomNumber });

  })

  socket.on('disconnect', async ({ name, roomNum }, callback) => {
    console.log('user disconnected', socket.id, roomNum);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

function generate(len = 5) {
  let charset = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM"
  let result = ""
  for (let i = 0; i < len; i++) {
    let charsetlength = charset.length
    result += charset.charAt(Math.floor(Math.random() * charsetlength))
  }
  return result;
}