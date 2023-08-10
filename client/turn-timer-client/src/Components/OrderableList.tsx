import { useListState } from '@mantine/hooks';
import { useRoomContext } from '../Context/RoomContext';
import { Button, Stack } from '@mantine/core';
import { useEffect } from 'react';
import { IconArrowUp, IconArrowDown } from '@tabler/icons-react'
import { socket } from '../../socket';

interface OrderableListProps {
  data: string[];
}

export function OrderableList({ data }: OrderableListProps) {
  const { playersInRoom, setPlayersInRoom } = useRoomContext();
  const [state, handlers] = useListState(data);

  useEffect(() => {
    handlers.setState(playersInRoom)
  }, [playersInRoom])

  const onClickDown = (index: number) => {
    const downIndex = index + 1;
    handlers.reorder({ from: index, to: downIndex || state.length-1 })
  }

  const onClickUp = (index: number) => {
    const upIndex = index - 1;
    handlers.reorder({ from: index, to: upIndex || 0 })
  }

  function confirm() {
    socket.emit('confirmOrder', {
      players: state,
      roomNum: localStorage.getItem('roomCode')
    })
    setPlayersInRoom!(state);
  }

  return <><Stack style={{ display: "flex", alignItems: 'center', justifyContent: 'space-evenly' }}>
    Set turn order and confirm:
    {state.map((data, index) => {
      return <div key={data} style={{ textAlign: 'center', width: '100%', justifyContent: 'space-between', display: 'flex' }}>
        <Button compact variant={'subtle'} onClick={() => onClickUp(index)}><IconArrowUp /></Button>
        <div>{data}</div>
        <Button compact variant={'subtle'} size={'xs'} onClick={() => onClickDown(index)}><IconArrowDown /></Button>
      </div>
    })}
  </Stack>
    <Button onClick={confirm}>Confirm Order</Button>
  </>
}
