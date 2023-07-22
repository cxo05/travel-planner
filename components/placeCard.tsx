import { NextPage } from "next";
import Image from 'next/image'

import { Card } from 'primereact/card';
import { Button } from 'primereact/button'
import { Category, Item } from "@prisma/client";
import { mutate } from "swr";
import { CalendarEvent, ItemInclude } from "../lib/swr";
import { DragEvent, useEffect, useRef, useState } from "react";
import { createRoot } from 'react-dom/client';
import { confirmDialog } from "primereact/confirmdialog";
import { MenuItem } from "primereact/menuitem";
import { Menu } from "primereact/menu";

interface Props {
  item: ItemInclude
  handleEdit: (item: ItemInclude) => void
  handleDragStart: (item: CalendarEvent) => void
}

const PlaceCard: NextPage<Props> = (props) => {
  const { item, handleEdit, handleDragStart } = props;

  const [imageUrl, setImageUrl] = useState("")

  const menu = useRef<Menu>(null);

  const items: MenuItem[] = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => handleEdit(item)
    },
    {
      label: 'Delete',
      icon: 'pi pi-times',
      command: () => confirmDialog({
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
      })
    },
  ]

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

  const header = (
    <div className="relative">
      {/* TODO Find out why Image doesnt work on google place photos on production */}
      {imageUrl != "" &&
        <img
          src={imageUrl}
          style={{ maxHeight: "150px", objectFit: "cover" }}
          width={500}
          height={500}
          alt="Picture of the Place">
        </img>
      }
      <Menu model={items} popup ref={menu} popupAlignment="right" />
      <Button
        icon="pi pi-ellipsis-v"
        rounded
        severity="secondary"
        className="absolute top-0 right-0 m-2"
        aria-label="Cancel"
        onClick={(event) => menu!.current!.toggle(event)}
      />
    </div>
  )

  const title = <div className='flex justify-between'>
    <p className="text-lg">{item.name}</p>
  </div>

  return (
    <div
      draggable="true"
      className="lg:basis-1/6 md:basis-1/5 grow-0 shrink-0 max-w-xs"
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
        className={`
            h-full 
            overflow-hidden 
            ${item._count.ScheduledItem > 0 ? "grayscale" : ""}`
        }
      >
        {item.notes && <p>{item.notes}</p>}
      </Card>
    </div>
  )
};

export default PlaceCard;