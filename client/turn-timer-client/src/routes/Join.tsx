import { Button, Text } from '@mantine/core'
import { useRoomContext } from "../Context/RoomContext";
import { useNavigate } from 'react-router-dom';
import { socket } from '../../socket';

export function Join() {
  const { isConnected, playersInRoom, currentRoom, playerName, setPlayersInRoom, setIsInRoom } = useRoomContext();
  const navigate = useNavigate();

  function leave() {
    console.log('leaving...')
    socket.emit('leave', { name: playerName, roomNum: currentRoom });
    setPlayersInRoom!([]);
    setIsInRoom!(false);
    localStorage.setItem('roomCode', '')
    navigate('/joinorhost')
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
      <Button onClick={leave}>Leave Room</Button>
    </>)
}