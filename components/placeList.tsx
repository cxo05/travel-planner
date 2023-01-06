import PlaceCard from './placeCard';
import { NextPage } from 'next';

import { TabView, TabPanel } from 'primereact/tabview';
import { SelectButton } from 'primereact/selectbutton';
import { useState } from 'react';
import { Button } from 'primereact/button';

interface Props {
  places: { name: string; notes: string; category: string; }[];
}

const PlaceList: NextPage<Props> = (props) => {
  const { places } = props;

  const [activeIndex, setActiveIndex] = useState(0);

  const options = [
    { label: 'Sightseeing', value: 0 },
    { label: 'Food', value: 1 },
    { label: 'Activities', value: 2 },
    { label: 'Others', value: 3 },
  ];

  return (
    <div className='mt-10'>
      <div className="flex items-center justify-center mx-5">
        <p className='text-lg font-bold'>Places</p>
        <div className='flex-grow'></div>
        <SelectButton value={activeIndex} options={options} unselectable={false} onChange={(e) => setActiveIndex(e.value)}></SelectButton>
        <div className='flex-grow'></div>
        <Button icon="pi pi-plus" className="p-button-rounded"></Button>
      </div>
      <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header="Sightseeing">
          <div className="grid grid-cols-4 gap-4">
            {places.filter((obj) => {
              return obj.category == "SIGHTSEEING"
            }).map((obj) => (
              <PlaceCard key={obj.name} name={obj.name} notes={obj.notes}></PlaceCard>
            ))}
          </div>
        </TabPanel>
        <TabPanel header="Food">
          <div className="grid grid-cols-4 gap-4">
            {places.filter((obj) => {
              return obj.category == "FOOD"
            }).map((obj) => (
              <PlaceCard key={obj.name} name={obj.name} notes={obj.notes}></PlaceCard>
            ))}
          </div>
        </TabPanel>
        <TabPanel header="Activities">
          <div className="grid grid-cols-4 gap-4">
            {places.filter((obj) => {
              return obj.category == "ACTIVITIES"
            }).map((obj) => (
              <PlaceCard key={obj.name} name={obj.name} notes={obj.notes}></PlaceCard>
            ))}
          </div>
        </TabPanel>
        <TabPanel header="Others">
          <div className="grid grid-cols-4 gap-4">
            {places.filter((obj) => {
              return obj.category == "OTHERS"
            }).map((obj) => (
              <PlaceCard key={obj.name} name={obj.name} notes={obj.notes}></PlaceCard>
            ))}
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default PlaceList;