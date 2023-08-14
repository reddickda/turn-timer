import { socket } from '../../socket';
import { Button, TextInput } from '@mantine/core';
import { useRoomContext } from '../Context/RoomContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Connect() {
  const { setPlayerName } = useRoomContext();
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  function connect() {
    // if value is null show alert?
    if (value !== '') {
      setPlayerName!(value);

      console.log("connected", value)
      socket.auth = { value };
      socket.connect();
      navigate('/joinorhost')
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
}// <Link style={{width: '100%'}} onClick={connect} to={'/joinorhost'}>Connect</Link>