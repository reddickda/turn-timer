import { Button, NumberInput, Text } from "@mantine/core";
import { OrderableList } from "../Components/OrderableList";
import { useState } from "react";
import { useRoomContext } from "../Context/RoomContext";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";

export function Host() {
  const { isConnected, currentRoom, playersInRoom, isHost, playerName, setIsHost, setPlayersInRoom } = useRoomContext();
  const [turnLength, setTurnLength] = useState<number | ''>(10);
  const navigate = useNavigate();

  function start() {
    console.log("start", playersInRoom)
    socket.emit('startGame', { roomNum: currentRoom, players: playersInRoom, turnLength: turnLength });
  }

  function leave() {
    if (isHost) {
      socket.emit('hostLeave', { name: playerName, roomNum: currentRoom });
    }
    setIsHost!(false);
    setPlayersInRoom!([]);
    localStorage.setItem('roomCode', '')
    navigate('/joinorhost');
  }

  if (!isConnected) {
    return;
  }

  return <>
    <Text>In room: {currentRoom}</Text>
    <OrderableList data={playersInRoom} />
    <Text align="start" size={'xs'}>Turn length(s)</Text>
    <NumberInput value={turnLength} onChange={setTurnLength} />
    <Button onClick={start}>Start Game</Button>
    <Button onClick={leave}>Leave Room</Button>
  </>
}