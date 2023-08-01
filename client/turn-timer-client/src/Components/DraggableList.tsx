import { Button, createStyles, rem, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useRoomContext } from '../Context/RoomContext';

const useStyles = createStyles((theme) => ({
  item: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    border: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
      }`,
    padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[6],
    marginBottom: theme.spacing.sm,
  },

  itemDragging: {
    boxShadow: theme.shadows.sm,
  },

  symbol: {
    fontSize: rem(30),
    fontWeight: 700,
    width: rem(60),
  },
}));

interface DndListProps {
  data: string[];
}

export function DraggableList({ data }: DndListProps) {
  const { playersInRoom, setPlayersInRoom } = useRoomContext();
  const { classes, cx } = useStyles();
  const [state, handlers] = useListState(data);

  function confirm() {
    console.log("confirm", state)

    setPlayersInRoom!(state);
  }

  useEffect(() => {
    handlers.setState(playersInRoom)
    console.log("useeffect", playersInRoom)
  }, [playersInRoom])
  const items = state.map((item, index) => (
    <Draggable key={item} index={index} draggableId={item}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Text>{item}</Text>
        </div>
      )}
    </Draggable>
  ));

  return (
    <>
      <DragDropContext
        onDragEnd={({ destination, source }) =>
          handlers.reorder({ from: source.index, to: destination?.index || 0 })
        }
      >
        <Droppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button onClick={confirm}>Confirm Order</Button>
    </>
  );
}