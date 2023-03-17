import React from 'react';
import { NextPage } from "next";
import { Calendar, CalendarChangeParams } from 'primereact/calendar';

interface Props {
  value: Date | undefined;
  onChange: (e: CalendarChangeParams) => void;
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