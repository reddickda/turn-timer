import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket";
import { useRoomContext } from "./RoomContext";

export function SocketListener() {
  const { setCurrentRoom, isConnected, setIsConnected, playerName, setPlayersInRoom, setGameStarted, setIsInRoom, setMyTurn, setGlobalTurnLength, setIsHost, currentRoom, isHost } = useRoomContext();
  const navigate = useNavigate();

  useEffect(() => {
    function onConnect() {

      setIsConnected!(true);
      navigate('/joinorhost')
    }

    function onDisconnect() {
      setPlayersInRoom!([]);
      setMyTurn!(false);
      setGameStarted!(false);
      setCurrentRoom!('')
      setIsInRoom!(false);
      setIsHost!(false);
      setIsConnected!(false);
    }

    function onConnectedUsers(value: { users: string[] }) {
      setPlayersInRoom!(value.users);
    }

    function onLeftGame() {
      if (isHost) {
        socket.emit('endGame', { roomNum: currentRoom, host: playerName })
        navigate('/host')
      } else {
        navigate('/joinorhost')
      }

      setMyTurn!(false);
      setGameStarted!(false);
    }

    function onStartedGame(value: { players: string[], turnLength: number }) {
      setPlayersInRoom!(value.players);
      setGameStarted!(true);
      setGlobalTurnLength!(value.turnLength);
      navigate('/game', { replace: true })
    }

    function onMyTurn(value: { name: string }) {
      console.log(value.name, playerName)
      if (value.name === playerName)
        setMyTurn!(true);
    }

    function onEndedGame(value: { host: string }) {
      setMyTurn!(false);
      setGameStarted!(false);
      if (value.host === playerName || isHost) {
        navigate('/host', { replace: true })
      } else {
        navigate('/join', { replace: true })
      }
    }

    function onHostLeftRoom(value: { room: string }) {
      socket.emit('leave', { name: playerName, roomNum: value.room });
      setMyTurn!(false);
      setGameStarted!(false);
      setCurrentRoom!('')
      setPlayersInRoom!([])
      setIsInRoom!(false);
      navigate('/joinorhost')
    }

    function onHosting(value: { roomCode: string }) {
      console.log('here')
      localStorage.setItem('roomCode', value.roomCode)
      setCurrentRoom!(value.roomCode);
      navigate('/host')
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connectedUsers', onConnectedUsers);
    socket.on('leftGame', onLeftGame);
    socket.on('startedGame', onStartedGame);
    socket.on('myTurn', onMyTurn);
    socket.on('endedGame', onEndedGame);
    socket.on('hostLeftRoom', onHostLeftRoom);
    socket.on('hosting', onHosting);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connectedUsers', onConnectedUsers);
      socket.off('leftGame', onLeftGame)
      socket.off('startedGame', onStartedGame);
      socket.off('myTurn', onMyTurn);
      socket.off('endedGame', onEndedGame);
      socket.off('hostLeftRoom', onHostLeftRoom);
      socket.off('hosting', onHosting);

    };
  }, [playerName, isConnected]);


  return <div></div>
}