
import { NextPage } from "next";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button'
import { DragPreviewImage, useDrag } from "react-dnd";

interface Props {
  name: string;
  notes: string;
}

export const ItemTypes = {
  PLACE: 'place'
}

const PlaceCard: NextPage<Props> = (props) => {
  const { name, notes } = props;

  const footer = <div>
    {/* <Button label="Edit" className="p-button-sm mr-1" /> */}
  </div>

  const title = <div className='flex justify-between'>
    <p>{name}</p>
    <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" aria-label="Cancel" />
  </div>

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PLACE,
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  return (
    <>
      <div ref={drag}>
        <Card title={title} footer={footer} style={{ opacity: isDragging ? 0.5 : 1 }}>
          <p >{notes}</p>
        </Card>
      </div>
    </>
  )
};

export default PlaceCard;