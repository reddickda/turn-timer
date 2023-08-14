import { NumberInput, Text } from "@mantine/core";
import { OrderableList } from "../Components/OrderableList";
import { useState } from "react";
import { useRoomContext } from "../Context/RoomContext";
import { socket } from "../../socket";
import { Link } from "react-router-dom";

export function Host() {
  const { isConnected, currentRoom, playersInRoom, isHost, playerName, setIsHost, setPlayersInRoom } = useRoomContext();
  const [turnLength, setTurnLength] = useState<number | ''>(10);
  
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
  }

  if (!isConnected) {
    return;
  }

  return <>
    <Text>In room: {currentRoom}</Text>
    <OrderableList data={playersInRoom} />
    <NumberInput value={turnLength} onChange={setTurnLength} />
    <Link onClick={start} to={'/game'}>Start Game</Link>
    <Link onClick={leave} to={'/joinorhost'}>Leave Room</Link>
  </>
}