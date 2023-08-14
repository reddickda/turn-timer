import { Stack, createStyles } from '@mantine/core'
import { SocketListener } from '../Context/SocketListener.tsx';
import '../App.css'
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useRoomContext } from '../Context/RoomContext.tsx';

const useStyles = createStyles(() => ({
  header: {
    marginTop: 50
  }
}))

export function PageWrapper() {
  const { isConnected } = useRoomContext();
  const { classes } = useStyles();
  const navigate = useNavigate()

  useEffect(() => {
    if(!isConnected) {
      navigate('/connect')
    }
  }, [isConnected])

  return <Stack spacing={'xs'} className={classes.header}>
    <Outlet />
    <SocketListener />
  </ Stack>
}