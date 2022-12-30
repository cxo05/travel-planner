import styles from '../styles/Home.module.css'

import { useSession } from "next-auth/react"
import PlaceCard from './placeCard';
import { NextPage } from 'next';
import DayCard from './dayCard';

interface Props {
  daysNum: number;
}

const TimeLine: NextPage<Props> = (props) => {
  const dayCards = (days: number) => {
    let content = []
    for (let i = 0; i < days; i++) {
      content.push(<DayCard key={i} name={i + ''}></DayCard>);
    }
    return content;
  }

  return (
    <div>
      <p>Timeline</p>
      <div className="grid grid-cols-4 gap-4">
        {dayCards(props.daysNum)}
      </div>
    </div>
  );
};

export default TimeLine;