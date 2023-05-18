
import { NextPage } from "next";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button'
import { DragPreviewImage, useDrag } from "react-dnd";
import { Item } from "@prisma/client";
import { mutate } from "swr";

interface Props {
  item: Item
  // planId: string
  // id: number
  // name: string
  // notes: string | null
}

export const ItemTypes = {
  PLACE: 'place'
}

const PlaceCard: NextPage<Props> = (props) => {
  const { item } = props;

  const footer = <div>
    {/* <Button label="Edit" className="p-button-sm mr-1" /> */}
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

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PLACE,
    item: item.name,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  return (
    <>
      <div ref={drag}>
        <Card title={title} footer={footer} style={{ opacity: isDragging ? 0.5 : 1 }}>
          <p >{item.notes}</p>
        </Card>
      </div>
    </>
  )
};

export default PlaceCard;