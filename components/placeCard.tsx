import styles from '../styles/Home.module.css'

import { NextPage } from "next";

interface Props {
  name: string;
}

const PlaceCard: NextPage<Props> = (props) => {
  const { name } = props;

  return (
    <div className="flex justify-center h-32 bg-slate-200">{name}</div>
  )
};

export default PlaceCard;