import { useDisclosure } from '@mantine/hooks';
import { Card, Group, Button, createStyles } from '@mantine/core';

const useStyles = createStyles(() => ({
  card:{
    zIndex: 1,
    maxWidth: 250, 
    position:'absolute', 
    top: 100, 
    marginLeft: 'auto', 
    marginRight:'auto'
  },
  overlay: {
    position:'fixed', 
    width:'100%', 
    height:'100%', 
    top: 0,
    bottom: 0,
    left: 0, 
    right: 0, 
    backgroundColor: 'black', 
    opacity: .8
  }
}));

export function HowToUseModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const { classes } = useStyles();

  return (
    <>
      {opened && <>
        <Card className={classes.card}>
          Turn Timer is a helpful application for keeping track of whose turn it is in large board games, card games, and more!
          Start by either hosting a room or joining your friends and family in an existing room.
          Once everyone has joined, the host can configure the timer and order of players and start!
          <Button size='xs' onClick={close}>Thanks!</Button>
        </Card>
        <div className={classes.overlay}></div>
      </>}

      <Group position="center">
        <Button size='xs' onClick={open}>How To Use</Button>
      </Group>
    </>
  );
}