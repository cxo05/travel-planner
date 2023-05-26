import { NextPage } from "next";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button'
import { Category, Item } from "@prisma/client";
import { mutate } from "swr";
import { CalendarEvent } from "../lib/swr";
import { DragEvent } from "react";
import { createRoot } from 'react-dom/client';

interface Props {
  item: Item
  handleEdit: (item: Item) => void
  handleDragStart: (item: CalendarEvent) => void
}

const PlaceCard: NextPage<Props> = (props) => {
  const { item, handleEdit, handleDragStart } = props;

  const footer = <div>
    <Button label="Edit" className="p-button-sm mr-1" onClick={() => handleEdit(item)} />
  </div>

  async function handleDeleteItem() {
    fetch(`/api/item/${item.id}`, {
      method: 'DELETE'
    }).then((res) => {
      return res.json() as Promise<Item>
    }).then(() => {
      mutate(`/api/item?planId=${item.planId}`);
    })
  }

  const title = <div className='flex justify-between'>
    <p>{item.name}</p>
    <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" aria-label="Cancel" onClick={handleDeleteItem} />
  </div>

  return (
    <>
      <div
        draggable="true"
        onDragStart={(event: DragEvent) => {
          let color = 'bg-lime-500'
          switch (item.category) {
            case Category.FOOD:
              color = 'bg-teal-400'
              break
            case Category.SIGHTSEEING:
              color = 'bg-lime-500'
              break
          }
          let dragImage =
            <div className={'rounded-md ' + color}>
              <span className="p-2">{item.name}</span>
            </div>

          var ghost = document.createElement('div');
          ghost.style.transform = "translate(-10000px, -10000px)";
          ghost.style.position = "absolute";
          document.body.appendChild(ghost);
          event.dataTransfer.setDragImage(ghost, 0, 0);
          const root = createRoot(ghost);

          root.render(dragImage);
          let scheduledItem: CalendarEvent = {
            itemId: item.id,
            title: item.name,
            category: item.category
          }
          handleDragStart(scheduledItem)
        }}
      >
        {/* <Card title={title} footer={footer} style={{ opacity: isDragging ? 0.5 : 1 }}> */}
        <Card title={title} footer={footer}>
          <p >{item.notes}</p>
        </Card>
      </div>
    </>
  )
};

export default PlaceCard;