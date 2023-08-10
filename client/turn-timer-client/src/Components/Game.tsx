import { Button, Paper, Stack } from "@mantine/core"
import { useRoomContext } from "../Context/RoomContext"
import { useEffect, useRef } from "react";
import Countdown from 'react-countdown';
import useSound from 'use-sound';
import { socket } from "../../socket";
import nextTurnSound from '../assets/mixkit-game-ball-tap-2073.wav'

export function Game() {
  const { myTurn, setMyTurn, playersInRoom, playerName, currentRoom, isHost, globalTurnLength } = useRoomContext();
  const [play] = useSound(nextTurnSound);
  const clockRef = useRef<Countdown>(null);

  useEffect(() => {
    if(myTurn){
      play()
    }
    console.log(myTurn)
  }, [playerName, myTurn])

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
  function pause(){
    clockRef?.current?.pause()
    // setPaused(true);
  }

  function resume(){
    clockRef?.current?.start()
    // setPaused(false);
  }
  // track current players turn
  // if current player is you, start timer

  // set my turn to false and emit next turn event
  // emit event based on your index in array +1, or if you are last, then make it first in the array

  return <>
  <Paper style={{ backgroundColor: myTurn ? 'green' : 'red', height: 200, width: 300 }}>
    {myTurn && <Stack>Your Turn!<Countdown ref={clockRef} date={Date.now() + (globalTurnLength * 1000)} renderer={renderer} />
    {<>
    <Button onClick={resume}>Start timer</Button> 
    <Button onClick={pause}>Pause Timer</Button></>}
    </Stack>}
  </Paper>
    {isHost && <Button onClick={endGame}>End Game</Button>}
  </>
}