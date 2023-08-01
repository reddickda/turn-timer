import { socket } from '../../socket';
import { Button, TextInput } from '@mantine/core';
import { useRoomContext } from '../Context/RoomContext';
import { useState } from 'react';
import { Room } from './Room';

export function HostOrJoin() {
  const { isConnected, currentRoom, isInRoom, playerName, isHost, setIsInRoom, setIsHost, setCurrentRoom, setPlayersInRoom } = useRoomContext();
  const [value, setValue] = useState('');
  // host is a join with no room number
  function host() {
    socket.emit('host');
    setIsHost!(true);
    setIsInRoom!(true);
    setCurrentRoom!(socket.id);
  }

  // join is a join with room number
  function join() {
    socket.emit('join', { name: playerName, roomNum: value }, (response: { status: string }) => {
      if (response.status === 'ok') {
        setCurrentRoom!(value);
        setIsInRoom!(true);
        return;
      } else {
        alert('room does not exist');
      }
    });
  }

  function leave() {
    if (isHost) {
      socket.emit('hostLeave', { name: playerName, roomNum: currentRoom });
    } else {
      console.log('leaving...')
      socket.emit('leave', { name: playerName, roomNum: currentRoom });
    }
    setIsHost!(false);
    setIsInRoom!(false);
    setPlayersInRoom!([]);
  }

  if (!isConnected) {
    return;
  }
  return (
    <>
      {
        isInRoom ?
          <>
            <Room />
            <Button onClick={leave}>Leave</Button>
          </>
          :
          <>
            <TextInput
              placeholder="Room Code"
              withAsterisk
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
            />
            <Button onClick={host}>Host</Button>
            <Button disabled={value == '' || value === undefined} onClick={join}>Join</Button>
          </>
      }
    </>)
}