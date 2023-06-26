import { NextPage } from "next";
import Image from 'next/image'

import { Card } from 'primereact/card';
import { Button } from 'primereact/button'
import { Category, Item } from "@prisma/client";
import { mutate } from "swr";
import { CalendarEvent } from "../lib/swr";
import { DragEvent, useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import { confirmDialog } from "primereact/confirmdialog";

interface Props {
  item: Item
  handleEdit: (item: Item) => void
  handleDragStart: (item: CalendarEvent) => void
}

const PlaceCard: NextPage<Props> = (props) => {
  const { item, handleEdit, handleDragStart } = props;

  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    let service = new google.maps.places.PlacesService(document.createElement('div'));

    service.getDetails({
      placeId: item.placeId as string,
      fields: ["photos"]
    }, (place) => {
      if (place != null && place.photos) {
        setImageUrl(place!.photos[0].getUrl())
      }
    })
  }, [item.placeId])

  async function handleDeleteItem() {
    confirmDialog({
      message: 'Do you want to delete this item? All scheduled events will be deleted.',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: () => {
        fetch(`/api/item/${item.id}`, {
          method: 'DELETE'
        }).then((res) => {
          return res.json() as Promise<Item>
        }).then(() => {
          mutate(`/api/item?planId=${item.planId}`);
          mutate(`/api/scheduledItem?planId=${item.planId}`);
        })
      },
    });
  }

  const header = (imageUrl != "" &&
    <div>
      <Image
        src={imageUrl}
        style={{ maxHeight: "150px", objectFit: "cover" }}
        width={500}
        height={500}
        alt="Picture of the Place">
      </Image>
    </div>
  )

  const title = <div className='flex justify-between'>
    <p className="text-lg">{item.name}</p>
    <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" aria-label="Cancel" onClick={handleDeleteItem} />
  </div>

  const footer = <div>
    <Button label="Edit" className="p-button-sm mr-1" onClick={() => handleEdit(item)} />
  </div>

  return (
    <>
      <div
        draggable="true"
        className="lg:basis-1/5 md:basis-1/4 grow-0 shrink-0"
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
            planId: item.planId,
            title: item.name,
            category: item.category
          }
          handleDragStart(scheduledItem)
        }}
      >
        <Card
          header={header}
          title={title}
          footer={footer}
          className="h-full overflow-hidden"
        >
          {item.notes && <p>{item.notes}</p>}
        </Card>
      </div>
    </>
  )
};

export default PlaceCard;