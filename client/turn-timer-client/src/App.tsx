import { useEffect } from 'react'
import { Text, Stack } from '@mantine/core';
import './App.css'
import { ConnectionManager } from './Components/ConnectionManager'
import { socket } from '../socket';
import { HostOrJoin } from './Components/HostOrJoin';
import { useRoomContext } from './Context/RoomContext';
import { Game } from './Components/Game';

function App() {
  const { setCurrentRoom, isConnected, setIsConnected, playerName, setPlayersInRoom, gameStarted, setGameStarted, setIsInRoom, setMyTurn, setGlobalTurnLength } = useRoomContext();

  useEffect(() => {
    function onConnect() {
      // if (socket.recovered) {
      //   // any missed packets will be received
      //   console.log("recovered")
      // } else {
      //   console.log("not recovered")
      //   setGameStarted!(false);
      //   setMyTurn!(false);
      //   // setPlayerName!(socket.auth);
      //     console.log(playerName)
      //   // new or unrecoverable session
      // }
      console.log("p name", playerName)
      setIsConnected!(true);
    }

    function onDisconnect() {
      setIsConnected!(false);
    }

    function onConnectedUsers(value: { users: string[] }) {
      console.log("connected users", value);
      setPlayersInRoom!(value.users);
    }

    function onLeftGame(value: { name: string }) {
      console.log("user left game");
      console.log("remaining", value.name)
      // set
    }

    function onStartedGame(value: { players: string[], turnLength: number }) {
      console.log("started game!", value);
      setPlayersInRoom!(value.players);
      setGameStarted!(true);
      setGlobalTurnLength!(value.turnLength);
    }

    function onMyTurn(value: { name: string }) {
      console.log("my turn!", value.name)
      console.log('my name', playerName)
      if (value.name === playerName)
        setMyTurn!(true);
    }

    function onEndedGame() {
      console.log('ended game :(')
      setMyTurn!(false);
      setGameStarted!(false);
    }

    function onHostLeftRoom(value: {room: string}) {
      console.log("host left...leaving...")
      socket.emit('leave', { name: playerName, roomNum: value.room });
      setMyTurn!(false);
      setGameStarted!(false);
      setCurrentRoom!('')
      setPlayersInRoom!([])
      setIsInRoom!(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connectedUsers', onConnectedUsers);
    socket.on('leftGame', onLeftGame);
    socket.on('startedGame', onStartedGame);
    socket.on('myTurn', onMyTurn);
    socket.on('endedGame', onEndedGame);
    socket.on('hostLeftRoom', onHostLeftRoom);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connectedUsers', onConnectedUsers);
      socket.off('leftGame', onLeftGame)
      socket.off('startedGame', onStartedGame);
      socket.off('myTurn', onMyTurn);
      socket.off('endedGame', onEndedGame);
      socket.off('hostLeftRoom', onHostLeftRoom);

    };
  }, [playerName]);

  return (
    <Stack>
      <Text size={'3em'}>Turn Timer</Text>
      <Text>Keep track of who's turn it is!</Text>

      {isConnected &&
        <>
          <Text>{playerName}</Text>
          {gameStarted ? <Game /> : <HostOrJoin />}
        </>
      }
      <ConnectionManager />
    </Stack>
  )
}

export default App
