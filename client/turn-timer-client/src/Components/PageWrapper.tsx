import { Stack, createStyles, Text } from '@mantine/core'
import { SocketListener } from '../Context/SocketListener.tsx';
import '../App.css'
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useRoomContext } from '../Context/RoomContext.tsx';
import { HowToUseModal } from './HowToUseModal.tsx';

const useStyles = createStyles(() => ({
  header: {
    marginTop: 50
  }
}))

export function PageWrapper() {
  const { isConnected, isInRoom, gameStarted } = useRoomContext();
  const { classes } = useStyles();
  const navigate = useNavigate()

  useEffect(() => {
    if(!isConnected) {
      navigate('/connect')
    }
  }, [isConnected])

  return <Stack spacing={'xs'} className={classes.header}>
    {!isInRoom && !gameStarted && <> <Text>Keep track of whose turn it is!</Text> <HowToUseModal /></>}
    <Outlet />
    <SocketListener />
  </ Stack>
}