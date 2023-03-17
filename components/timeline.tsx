import { NextPage } from 'next';
import dynamic from 'next/dynamic';

interface Props {
  dates: Date[];
}

const TimeLine: NextPage<Props> = (props) => {
  const DayCard = dynamic(() => import("./dayCard"), {
    ssr: false,
  })

  const dayCards = (dates: Date[]) => {
    let content = []
    for (let i = 0; i < dates.length; i++) {
      content.push(<DayCard key={i} date={dates.at(i)}></DayCard>);
    }
    return content;
  }

  return (
    <div className="flex gap-4">
      {dayCards(props.dates)}
    </div>
  );
};

export default TimeLine;