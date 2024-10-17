import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Page } from '@prisma/client';
import { useState } from 'react';

export default function DragAndDrop({ initialPages }: { initialPages: Page[] }) {
  const [items, setItems] = useState(initialPages);
  function onDragEnd(result) {
    console.log(result)
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    // If the item is dropped in the same place, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const newItems = Array.from(items);
    const [movedItem] = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, movedItem);
    setItems(newItems);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={"droppable-1"} direction="horizontal">
        {(provided, snapshot) => (
            <ItemList innerRef={provided.innerRef} {...provided.droppableProps}>
              {items.map((item, index) => (
                <Item key={item.id} item={item} index={index}/>
              ))}
              {provided.placeholder}
            </ItemList>
        )}
      </Droppable>
    </DragDropContext>
  );
}

function ItemList({children, innerRef, ...props}: { children: React.ReactNode, innerRef: any }) {
  return(<div className="grid grid-cols-4 gap-3" ref={innerRef}>{children}</div>)
}

function Item({item, index, ...props}: { item: Page, index: number }) {
  return(
    <>
      <Draggable draggableId={item.id.toString()} index={index}>
        {(provided) => (
          <div 
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <p>Page: {item.id}</p>
            {/* <img src={item.img} alt="" /> */}
          </div>
        )}
      </Draggable>
    </>
  )
}

function Container({children, ...props}: { children: React.ReactNode }) {
  return(<div>{children}</div>)
}