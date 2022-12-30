import styles from '../styles/Home.module.css'

import { useSession } from "next-auth/react"
import PlaceCard from './placeCard';
import { NextPage } from 'next';

interface Props {
  places: string[];
}

const PlaceList: NextPage<Props> = (props) => {
  const { places } = props;

  return (
    <div className='mt-10'>
      <p>Places To Visit</p>
      <div className="grid grid-cols-4 gap-4">
        <PlaceCard name="Add"></PlaceCard>
        {places.map((obj) => (
          <PlaceCard key={obj} name={obj}></PlaceCard>
        ))}
      </div>
    </div>
  );
};

export default PlaceList;