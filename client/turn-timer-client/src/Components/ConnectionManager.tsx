import { socket } from '../../socket';
import { Button, TextInput } from '@mantine/core';
import { useRoomContext } from '../Context/RoomContext';
import { useState } from 'react';

export function ConnectionManager() {
  const { isConnected, playerName, currentRoom, setIsInRoom, setPlayerName, setIsHost, setCurrentRoom, setPlayersInRoom, setGameStarted } = useRoomContext();
  const [value, setValue] = useState('');

  function connect() {
    setPlayerName!(value);
    
    console.log("connected", value)
    socket.auth = { value };
    socket.connect();
  }

  function disconnect() {
    console.log('disconnect pressed')
    setIsInRoom!(false);
    setPlayerName!('');
    setIsHost!(false);
    setPlayersInRoom!([]);
    setGameStarted!(false);
    setIsHost!(false);
    socket.emit('leave', { name: playerName, roomNum: currentRoom ?? socket.id.substring(0, 5) })
    socket.disconnect();
    setCurrentRoom!('');
  }

  return (
    <>
      {isConnected ?
        <Button onClick={disconnect}>Disconnect</Button>
        :
        <>
        <TextInput
              placeholder="Your name"
              withAsterisk
              value={value} 
              onChange={(event) => setValue(event.currentTarget.value)}
            />
        <Button disabled={value === '' || value === undefined} onClick={connect}>Connect</Button>
        </>
      }
    </>
  );
}