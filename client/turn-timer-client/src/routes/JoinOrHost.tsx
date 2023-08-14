import { socket } from '../../socket';
import { TextInput, Text, Button } from '@mantine/core';
import { useRoomContext } from '../Context/RoomContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function JoinOrHost() {
  const { isConnected, playerName, setIsInRoom, setIsHost, setCurrentRoom } = useRoomContext();
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  // host is a join with no room number
  function host() {
    socket.emit('host');
    console.log('hosting')
    setIsHost!(true);
    setIsInRoom!(true);
    setCurrentRoom!(socket.id.substring(0, 5));
    localStorage.setItem('roomCode', socket.id.substring(0, 5))
    navigate('/host')
  }

  // join is a join with room number
  function join() {
    if (value !== '') {
      setCurrentRoom!(value);
      socket.emit('join', { name: playerName, roomNum: value }, (response: { status: string }) => {
        if (response.status === 'ok') {
          setCurrentRoom!(value);
          console.log('roomcoderesponse', value)
          localStorage.setItem('roomCode', value)
          setIsInRoom!(true);
          navigate('/join')
          return;
        } else {
          alert('room does not exist');
          setCurrentRoom!('');
        }
      });
    } else {
      alert('enter room code')
    }
  }

  if (!isConnected) {
    return;
  }
  return (
    <>
      <Text>{playerName}</Text>
      <TextInput
        placeholder="Room Code"
        withAsterisk
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
      <Button onClick={join} disabled={value === ''}>Join</Button>
      <Text>Or</Text>
      <Button onClick={host}>Host a Room</Button>
    </>
  )
}