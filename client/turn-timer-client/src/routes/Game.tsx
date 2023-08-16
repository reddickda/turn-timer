import { Button, Paper, Stack, Grid, Text } from "@mantine/core"
import { useRoomContext } from "../Context/RoomContext"
import { useLayoutEffect, useRef } from "react";
import Countdown from 'react-countdown';
import useSound from 'use-sound';
import { socket } from "../../socket";
import nextTurnSound from '../assets/mixkit-game-ball-tap-2073.wav'

export function Game() {
  const { myTurn, setMyTurn, playersInRoom, playerName, currentRoom, isHost, globalTurnLength, setPlayersInRoom } = useRoomContext();
  const [play] = useSound(nextTurnSound);
  const clockRef = useRef<Countdown>(null);

  useLayoutEffect(() => {
    if (myTurn) {
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
      return (<Text>
        {hours}:{minutes}:{seconds}
      </Text>)
    }
  }

  function endGame() {
    socket.emit('endGame', { roomNum: currentRoom, host: playerName })
  }

  function leave() {
    console.log('leaving...')
    socket.emit('leave', { name: playerName, roomNum: currentRoom });

    setPlayersInRoom!([]);
    localStorage.setItem('roomCode', '')
  }

  function pause() {
    clockRef?.current?.pause()
    // setPaused(true);
  }
  function resume() {
    clockRef?.current?.start()
    // setPaused(false);
  }

  return <>
  <Text>{playerName}</Text>
    <Paper style={{ backgroundColor: myTurn ? 'green' : 'red', height: '50vh', width: 300 }}>
      {myTurn && <Stack style={{height: '100%'}}><div style={{backgroundColor:'#228be6', borderRadius: 5, margin: 5}}>Your Turn!<Countdown ref={clockRef} date={Date.now() + (globalTurnLength * 1000)} renderer={renderer} /></div>
        {<>
        <div style={{display:'flex', height:'100%'}}></div>
          <Grid dir="row" mb={5}>
            <Grid.Col>
              <Button onClick={resume}>Start timer</Button>
            </Grid.Col>
            <Grid.Col>
              <Button onClick={pause}>Pause Timer</Button>
            </Grid.Col>
          </Grid>
        </>
        }
      </Stack>}
    </Paper>
    {isHost && <Button onClick={endGame}>End Game</Button>}
    {!isHost && <Button onClick={leave}>Leave Game</Button>}
  </>
}