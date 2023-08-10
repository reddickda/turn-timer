import { Button, NumberInput, Text } from "@mantine/core";
import { useRoomContext } from "../Context/RoomContext"
import { socket } from "../../socket";
import { useEffect, useState } from "react";
import { OrderableList } from "./OrderableList";

export function Room() {
  const { isHost, currentRoom, playersInRoom } = useRoomContext();
  const [turnLength, setTurnLength] = useState<number | ''>(10) 

  useEffect(() => {

  }, [playersInRoom])
  // only host can start
  function start() {
    console.log("start", playersInRoom)
    socket.emit('startGame', { roomNum: currentRoom, players: playersInRoom, turnLength: turnLength });
  }

  return (
    <>
      <Text>In room: {currentRoom}</Text>
      {!isHost && playersInRoom.map((player: string) => {
        return <Text key={player}>{player}</Text>
      })}
      {isHost &&
        <>
          <OrderableList data={playersInRoom} />
          <NumberInput value={turnLength} onChange={setTurnLength} />
          <Button onClick={start}>Start Game</Button>
        </>}
    </>
  )
}
