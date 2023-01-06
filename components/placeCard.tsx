import styles from '../styles/Home.module.css'

import { NextPage } from "next";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button'

interface Props {
  name: string;
  notes: string;
}

const PlaceCard: NextPage<Props> = (props) => {
  const { name, notes } = props;

  const footer = <div>
    <Button label="Edit" className="p-button-sm mr-1" />
  </div>

  const title = <div className='flex justify-between'>
    <p>{name}</p>
    <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" aria-label="Cancel" />
  </div>

  return (
    <Card title={title} footer={footer}>
      <p>{notes}</p>
    </Card>
  )
};

export default PlaceCard;