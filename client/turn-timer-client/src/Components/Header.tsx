import { Title } from '@mantine/core'
import { useEffect } from 'react'
import { useRoomContext } from '../Context/RoomContext';

export function Header() {
  const  { isConnected, isHost } = useRoomContext();
  
  useEffect(() => {
    console.log(isConnected)
    console.log('why we here', isHost)
  }, [isConnected])
  return (
    <>
      <div style={{position: 'absolute', top: 0, left:0, height: 50, width: '100%', justifyContent: 'center', backgroundColor: '#3241ce', display: 'flex', alignItems: 'center'}}>
        <Title>Turn Timer</Title>
      </div>
    </>
  )
}