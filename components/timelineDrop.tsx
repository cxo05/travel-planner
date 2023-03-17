import { NextPage } from "next"
import { useState } from "react"
import { useDrop } from 'react-dnd'

type Props = {

}

const TimelineDrop: NextPage<Props> = (props) => {
  let [placeName, setPlaceName] = useState("");

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "place",
    drop: (item: any) => {
      setPlaceName(item.name);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      item: monitor.getItem()
    }),
  }))

  return (
    <div
      ref={drop}
      className="flex h-full"
    >
      {placeName}
    </div>
  )
}

export default TimelineDrop