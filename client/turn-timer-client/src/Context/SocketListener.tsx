import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket";
import { useRoomContext } from "./RoomContext";

export function SocketListener() {
  const { setCurrentRoom, isConnected, setIsConnected, playerName, setPlayersInRoom, setGameStarted, setIsInRoom, setMyTurn, setGlobalTurnLength, setIsHost } = useRoomContext();
  const navigate = useNavigate();

  useEffect(() => {
    function onConnect() {

      setIsConnected!(true);
    }

    function onDisconnect() {
      console.log("disconnected!")
      setPlayersInRoom!([]);
      setMyTurn!(false);
      setGameStarted!(false);
      setCurrentRoom!('')
      setIsInRoom!(false);
      setIsHost!(false);
      setIsConnected!(false);
    }

    function onConnectedUsers(value: { users: string[] }) {
      console.log("connected users", value);
      setPlayersInRoom!(value.users);
    }

    function onLeftGame(value: { name: string }) {
      console.log("user left game");
      console.log("remaining", value.name)
      // set
    }

    function onStartedGame(value: { players: string[], turnLength: number }) {
      console.log("started game!", value);
      setPlayersInRoom!(value.players);
      setGameStarted!(true);
      setGlobalTurnLength!(value.turnLength);
      navigate('/game', { replace: true})
    }

    function onMyTurn(value: { name: string }) {
      console.log("my turn!", value.name)
      console.log('my name', playerName)
      if (value.name === playerName)
        setMyTurn!(true);
    }

    function onEndedGame(value: { host: string }) {
      console.log('ended game :(', playerName)
      setMyTurn!(false);
      setGameStarted!(false);
      if(value.host === playerName)
      {
        navigate('/host', { replace: true})
      }else {
        navigate('/join', { replace: true})
      }
    }

    function onHostLeftRoom(value: { room: string }) {
      console.log("host left...leaving...")
      socket.emit('leave', { name: playerName, roomNum: value.room });
      setMyTurn!(false);
      setGameStarted!(false);
      setCurrentRoom!('')
      setPlayersInRoom!([])
      setIsInRoom!(false);
      navigate('/joinorhost')
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connectedUsers', onConnectedUsers);
    socket.on('leftGame', onLeftGame);
    socket.on('startedGame', onStartedGame);
    socket.on('myTurn', onMyTurn);
    socket.on('endedGame', onEndedGame);
    socket.on('hostLeftRoom', onHostLeftRoom);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connectedUsers', onConnectedUsers);
      socket.off('leftGame', onLeftGame)
      socket.off('startedGame', onStartedGame);
      socket.off('myTurn', onMyTurn);
      socket.off('endedGame', onEndedGame);
      socket.off('hostLeftRoom', onHostLeftRoom);

    };
  }, [playerName, isConnected]);


  return <div></div>
}