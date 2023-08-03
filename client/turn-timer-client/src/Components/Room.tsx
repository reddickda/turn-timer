import { Button, NumberInput, Text } from "@mantine/core";
import { useRoomContext } from "../Context/RoomContext"
import { DraggableList } from "./DraggableList";
import { socket } from "../../socket";
import { useState } from "react";

export function Room() {
  const { isHost, currentRoom, playersInRoom } = useRoomContext();
  const [turnLength, setTurnLength] = useState<number | ''>(10) 
  // only host can start
  function start() {
    // gather order of players
    // dragable order list
    // set current players in game as order
    // confirm order
    console.log("start", playersInRoom)
    socket.emit('startGame', { roomNum: currentRoom, players: playersInRoom, turnLength: turnLength });
    // emit event to set current players context order for everyone else
    // emit game start event
    // game start event to each player in room in order
    // first player gets a 'active' state and screen turns green, timer starts
    // when players turn is up, set 'inactive', emit event to next player in order
  }

  return (
    <>
      <Text>In room: {currentRoom}</Text>
      {isHost ? <div>you are host</div> : <div>you are player</div>}
      <Text>Players in room:</Text>
      {playersInRoom.map((player: string) => {
        return <Text key={player}>{player}</Text>
      })}
      {isHost &&
        <>
          <DraggableList data={playersInRoom} />
          <NumberInput value={turnLength} onChange={setTurnLength} />
          <Button onClick={start}>Start Game</Button>
        </>}
    </>
  )
}
