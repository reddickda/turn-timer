import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';

interface IRoomContext {
  playerName: string,
  currentRoom: string,
  playersInRoom: string[],
  isConnected: boolean,
  isInRoom: boolean,
  isHost: boolean,
  gameStarted: boolean,
  myTurn: boolean,
  globalTurnLength: number,
  currentPlayersTurn: string,
  setGlobalTurnLength?: Dispatch<SetStateAction<number>>, 
  setMyTurn?: Dispatch<SetStateAction<boolean>>, 
  setGameStarted?: Dispatch<SetStateAction<boolean>>,
  setIsInRoom?: Dispatch<SetStateAction<boolean>>,
  setIsConnected?: Dispatch<SetStateAction<boolean>>,
  setPlayerName?: Dispatch<SetStateAction<string>>,
  setCurrentRoom?: Dispatch<SetStateAction<string>>,
  setPlayersInRoom?: Dispatch<SetStateAction<string[]>>,
  setIsHost?: Dispatch<SetStateAction<boolean>>,
  setCurrentPlayersTurn?: Dispatch<SetStateAction<string>>,
}

const RoomContext = createContext<IRoomContext>({
  playerName: '',
  currentRoom: '',
  playersInRoom: [],
  isConnected: false,
  isInRoom: false,
  isHost: false,
  gameStarted: false,
  myTurn: false,
  currentPlayersTurn: '',
  globalTurnLength: 10,
  setGlobalTurnLength: undefined,
  setMyTurn: undefined,
  setGameStarted: undefined,
  setIsInRoom: undefined,
  setIsConnected: undefined,
  setPlayerName: undefined,
  setCurrentRoom: undefined,
  setPlayersInRoom: undefined,
  setIsHost: undefined,
  setCurrentPlayersTurn: undefined,
});

interface IContextProvider {
  children: JSX.Element | JSX.Element[]
}

export const ContextProvider = ({ children }: IContextProvider) => {
  const [playerName, setPlayerName] = useState('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isInRoom, setIsInRoom] = useState<boolean>(false);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [currentRoom, setCurrentRoom] = useState<string>('');
  const [playersInRoom, setPlayersInRoom] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [myTurn, setMyTurn] = useState<boolean>(false);
  const [globalTurnLength, setGlobalTurnLength] = useState<number>(10)
  const [currentPlayersTurn, setCurrentPlayersTurn] = useState<string>('')

  if (!RoomContext) {
    throw new Error(
      "useCurrentUser has to be used within <RoomContext.Provider>"
    );
  }

  return (
    <RoomContext.Provider value={{
      playerName,
      setPlayerName,
      isConnected,
      setIsConnected,
      isInRoom,
      setIsInRoom,
      currentRoom,
      setCurrentRoom,
      playersInRoom,
      setPlayersInRoom,
      isHost,
      setIsHost,
      gameStarted,
      setGameStarted,
      myTurn,
      setMyTurn,
      globalTurnLength,
      setGlobalTurnLength,
      currentPlayersTurn,
      setCurrentPlayersTurn
    }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoomContext() {
  return useContext(RoomContext);
}