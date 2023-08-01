import { useEffect } from 'react'
import { Text, Stack } from '@mantine/core';
import './App.css'
import { ConnectionManager } from './Components/ConnectionManager'
import { socket } from '../socket';
import { HostOrJoin } from './Components/HostOrJoin';
import { useRoomContext } from './Context/RoomContext';
import { Game } from './Components/Game';

function App() {
  const { isConnected, setIsConnected, playerName, setPlayersInRoom, gameStarted, setGameStarted, setMyTurn } = useRoomContext();

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
      console.log("users", value);
      setPlayersInRoom!(value.users);
    }

    function onLeftGame() {
      console.log("user left game");
      // set
    }

    function onStartedGame(value: { players: string[] }) {
      console.log("started game!", value);
      setPlayersInRoom!(value.players);
      setGameStarted!(true);
    }

    function onMyTurn(value: { name: string}) {
      console.log("my turn!", value.name)
      console.log('my name', playerName)
      if(value.name === playerName)
        setMyTurn!(true);
    }

    function onEndedGame() {
      console.log('ended game :(')
      setMyTurn!(false);
      setGameStarted!(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connectedUsers', onConnectedUsers);
    socket.on('leftGame', onLeftGame);
    socket.on('startedGame', onStartedGame);
    socket.on('myTurn', onMyTurn);
    socket.on('endedGame', onEndedGame);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connectedUsers', onConnectedUsers);
      socket.off('leftGame', onLeftGame)
      socket.off('startedGame', onStartedGame);
      socket.off('myTurn', onMyTurn);
      socket.off('endedGame', onEndedGame);
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
