import { Button, Paper } from "@mantine/core"
import { useRoomContext } from "../Context/RoomContext"
import { useEffect } from "react";
import Countdown from 'react-countdown';
import { socket } from "../../socket";

export function Game() {
  const { myTurn, setMyTurn, playersInRoom, playerName, currentRoom } = useRoomContext();

  useEffect(() => {
  }, [playerName])

  const renderer = ({ hours, minutes, seconds, completed }: { hours: number, minutes: number, seconds: number, completed: boolean }) => {
    if (completed) {
      setMyTurn!(false);
      let myIndex = playersInRoom.indexOf(playerName);
      if ((myIndex + 1) === playersInRoom.length) {
        myIndex = 0;
      } else {
        myIndex = myIndex + 1;
      }
      socket.emit('nextTurn', { name: playersInRoom[myIndex], roomNum: currentRoom })
      return <>Not your turn</>;
    } else {
      return (<span>
        {hours}:{minutes}:{seconds}
      </span>)
    }
  }

  function endGame() {
    socket.emit('endGame', { roomNum: currentRoom })
  }
  // track current players turn
  // if current player is you, start timer

  // set my turn to false and emit next turn event
  // emit event based on your index in array +1, or if you are last, then make it first in the array

  return <><Paper style={{ backgroundColor: myTurn ? 'green' : 'red', height: 200, width: 300 }}>Game!
    {myTurn && <Countdown date={Date.now() + 10000} renderer={renderer} />}
  </Paper>
    <Button onClick={endGame}>End Game</Button>
  </>
}