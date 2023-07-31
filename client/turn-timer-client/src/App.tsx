import { useEffect } from 'react'
import { Text, Stack } from '@mantine/core';
import './App.css'
import { ConnectionManager } from './Components/ConnectionManager'
import { socket } from '../socket';
import { HostOrJoin } from './Components/HostOrJoin';
import { useRoomContext } from './Context/RoomContext';

function App() {
  const { isConnected, setIsConnected, playerName, setPlayersInRoom } = useRoomContext();

  useEffect(() => {
    function onConnect() {
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
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connectedUsers', onConnectedUsers);
    socket.on('leftGame', onLeftGame);


    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connectedUsers', onConnectedUsers);
      socket.off('leftGame', onLeftGame)
    };
  }, []);

  return (
    <Stack>
      <Text size={'3em'}>Turn Timer</Text>
      <Text>Keep track of who's turn it is!</Text>

      {isConnected &&
        <>
          <Text>{playerName}</Text>
          <HostOrJoin />
        </>
      }
      <ConnectionManager />
    </Stack>
  )
}

export default App
