import styles from '../styles/Home.module.css'

import { useSession } from "next-auth/react"
import PlaceCard from './placeCard';

export default function PlaceList(daysNum: { daysNum: number; }) {
  const { data: session, status } = useSession()

  const placeCards = (days: number) => {
    let content = []
    for (let i = 0; i < days; i++) {
      content.push(<PlaceCard key={i} name={i + ''}></PlaceCard>);
    }
    return content;
  }

  const places = ['ONE', 'TWO', 'THREE', '4', '5', '6', '7', '8'];

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <PlaceCard name="Add"></PlaceCard>
        {placeCards(daysNum.daysNum)}
      </div>
    </div>
  );
};