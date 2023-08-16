import { socket } from '../../socket';
import { Button, TextInput } from '@mantine/core';
import { useRoomContext } from '../Context/RoomContext';
import { useEffect, useState } from 'react';

export function Connect() {
  const { setPlayerName } = useRoomContext();
  const [value, setValue] = useState('');

  useEffect(() => {
    socket.disconnect();
  }, [])

  function connect() {
    // if value is null show alert?
    if (value !== '') {
      setPlayerName!(value);

      console.log("connected", value)
      socket.auth = { value };
      socket.connect();
    } else {
      alert('must set a player name')
    }
  }

  return (
    <>
      <TextInput
        placeholder="Your name"
        withAsterisk
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
      <Button onClick={connect} disabled={value === ''}>Connect</Button>
    </ >
  );
}