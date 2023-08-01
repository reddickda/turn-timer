import { socket } from '../../socket';
import { Button, TextInput } from '@mantine/core';
import { useRoomContext } from '../Context/RoomContext';
import { useState } from 'react';

export function ConnectionManager() {
  const { isConnected, playerName, currentRoom, setIsInRoom, setPlayerName, setIsHost, setCurrentRoom, setPlayersInRoom } = useRoomContext();
  const [value, setValue] = useState('');

  function connect() {
    setPlayerName!(value);
    
    console.log("connected", value)
    socket.auth = { value };
    socket.connect();
  }

  // TODO reload last state on disconnect
  function disconnect() {
    console.log('disconnect pressed')
    setIsInRoom!(false);
    setPlayerName!('');
    setIsHost!(false);
    setPlayersInRoom!([]);
    setIsHost!(false);
    socket.emit('leave', { name: playerName, roomNum: currentRoom ?? socket.disconnect })
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