import { socket } from '../../socket';
import { Button, TextInput } from '@mantine/core';
import { useRoomContext } from '../Context/RoomContext';
import { useState } from 'react';
import { PageWrapper } from '../Components/PageWrapper';

export function JoinOrHost() {
  const { isConnected, playerName, setIsInRoom, setIsHost, setCurrentRoom } = useRoomContext();
  const [value, setValue] = useState('');
  // host is a join with no room number
  function host() {
    socket.emit('host');
    setIsHost!(true);
    setIsInRoom!(true);
    setCurrentRoom!(socket.id.substring(0, 5));
    localStorage.setItem('roomCode', socket.id.substring(0, 5))
  }

  // join is a join with room number
  function join() {
    setCurrentRoom!(value);
    console.log('roomcode', value)
    socket.emit('join', { name: playerName, roomNum: value }, (response: { status: string }) => {
      if (response.status === 'ok') {
        setCurrentRoom!(value);
        console.log('roomcoderesponse', value)
        localStorage.setItem('roomCode', value)

        setIsInRoom!(true);
        return;
      } else {
        alert('room does not exist');
        setCurrentRoom!('');

      }
    });
  }

  if (!isConnected) {
    console.log(isConnected)
    return;
  }
  return (

    <PageWrapper>
      <TextInput
        placeholder="Room Code"
        withAsterisk
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
      <Button onClick={host}>Host</Button>
      <Button disabled={value == '' || value === undefined} onClick={join}>Join</Button>

    </ PageWrapper>
  )
}