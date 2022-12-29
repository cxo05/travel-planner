import styles from '../styles/Home.module.css'

import { useSession } from "next-auth/react"
import PlaceCard from './placeCard';

export default function PlaceList() {
  const { data: session, status } = useSession()

  const places = ['ONE', 'TWO', 'THREE', '4', '5', '6', '7', '8'];

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <PlaceCard name="Add"></PlaceCard>
        {places.map((obj) => (
          <PlaceCard key={obj} name={obj}></PlaceCard>
        ))}
      </div>
    </div>
  );
};