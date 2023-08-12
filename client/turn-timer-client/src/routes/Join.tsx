import { Text } from '@mantine/core'
import { useRoomContext } from "../Context/RoomContext";

export function Join() {
  const { isConnected, playersInRoom, currentRoom } = useRoomContext();

  if (!isConnected) {
    return;
  }
  return (
    <>
      <Text>In room: {currentRoom}</Text>
      {playersInRoom.map((player: string) => {
        return <Text key={player}>{player}</Text>
      })}
    </>)
}