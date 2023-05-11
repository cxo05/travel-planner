import React from 'react';
import { NextPage } from "next";
import { Calendar } from 'primereact/calendar';

interface Props {
  value: Date | undefined;
  onChange: (e: any) => void;
}

const DatePicker: NextPage<Props> = (props) => {
  const { value, onChange } = props;

  return (
    <div>
      <Calendar
        selectionMode="single"
        value={value}
        onChange={onChange}>
      </Calendar>
    </div>
  );
}

export default DatePicker;