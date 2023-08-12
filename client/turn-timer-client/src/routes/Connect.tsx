import { socket } from '../../socket';
import { TextInput } from '@mantine/core';
import { useRoomContext } from '../Context/RoomContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Connect() {
  const { setPlayerName } = useRoomContext();
  const [value, setValue] = useState('');

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
      <Link onClick={connect} to={value !== '' ? '/joinorhost' : '/'}>Connect</Link>
    </ >
  );
}