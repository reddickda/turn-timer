import { Button, Text } from "@mantine/core";
import { useRoomContext } from "../Context/RoomContext"

export function Room() {
  const { isHost, currentRoom, playersInRoom } = useRoomContext();

  // only host can start
  function start() {
    // gather order of players
      // dragable order list
      // set current players in game as order
      // confirm order
      // emit event to set current players context order for everyone else
    // emit game start event
    // game start event to each player in room in order
    // first player gets a 'active' state and screen turns green, timer starts
    // when players turn is up, set 'inactive', emit event to next player in order
  }

  return (<>
    <Text>In room: {currentRoom}</Text>
    {isHost ? <div>you are host</div> : <div>you are player</div>}
    <Text>Players in room:</Text>
    {playersInRoom.map((player: string) => {
      return <Text key={player}>{player}</Text>
    })}
    {isHost && <Button onClick={start}>Start Game</Button>}
  </>
  )
}