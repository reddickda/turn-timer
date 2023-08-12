import { Stack, createStyles } from '@mantine/core'
import { SocketListener } from '../Context/SocketListener.tsx';
import '../App.css'
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const useStyles = createStyles(() => ({
  header: {
    marginTop: 50
  }
}))

export function PageWrapper() {
  const { classes } = useStyles();
  const navigate = useNavigate()

  useEffect(() =>{
    navigate('/connect')
  },[])

  return <Stack spacing={'xs'} className={classes.header}>
    <Outlet />
    <SocketListener />
  </ Stack>
}