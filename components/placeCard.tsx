import styles from '../styles/Home.module.css'

import { NextPage } from "next";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button'

interface Props {
  name: string;
}

const PlaceCard: NextPage<Props> = (props) => {
  const { name } = props;

  const footer = <div>
    <Button label="Edit" icon="pi pi-check" style={{ marginRight: '.25em' }} />
    <Button label="Delete" icon="pi pi-times" className="p-button-secondary" />
  </div>

  return (
    <Card title={name} footer={footer}>
      <p>Insert Notes Here</p>
    </Card>
  )
};

export default PlaceCard;