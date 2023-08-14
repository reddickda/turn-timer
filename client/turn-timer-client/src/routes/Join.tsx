import { Text } from '@mantine/core'
import { useRoomContext } from "../Context/RoomContext";
import { Link } from 'react-router-dom';
import { socket } from '../../socket';

export function Join() {
  const { isConnected, playersInRoom, currentRoom, playerName, setPlayersInRoom } = useRoomContext();

  function leave() {
    console.log('leaving...')
    socket.emit('leave', { name: playerName, roomNum: currentRoom });
    setPlayersInRoom!([]);
    localStorage.setItem('roomCode', '')
  }

  if (!isConnected) {
    return;
  }
  return (
    <>
      <Text>In room: {currentRoom}</Text>
      {playersInRoom.map((player: string) => {
        return <Text key={player}>{player}</Text>
      })}
      <Link onClick={leave} to={'/joinorhost'}>Leave Room</Link>
    </>)
}