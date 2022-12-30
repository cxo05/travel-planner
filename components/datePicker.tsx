import styles from '../styles/Home.module.css'

import React, { ChangeEvent, useState } from 'react';

export default function DatePicker(props: { getDaysNum: (arg0: number) => void; }) {
  let [daysNum, setDaysNum] = useState(0)
  
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    let days = parseInt(event.target.value.replace(/\D/g, ''))
    setDaysNum(days ? days : 0)
    props.getDaysNum(days? days : 0)
  };

  return (
    <div>
      <input
        name='daysNum'
        placeholder='Number Of Days'
        onChange={onChange}
        value={daysNum}
      />
    </div>
  );
}