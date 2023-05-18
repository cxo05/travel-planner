import PlaceCard from './placeCard';
import CreateItemDialog from './createItemDialog';

import { TabView, TabPanel } from 'primereact/tabview';
import { SelectButton } from 'primereact/selectbutton';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { Category } from '@prisma/client';
import { useRouter } from 'next/router';
import { useItems } from '../lib/swr'

const PlaceList = () => {
  const router = useRouter()
  const { id } = router.query

  const [activeIndex, setActiveIndex] = useState(0);
  const [display, setDisplay] = useState(false);
  const [displayHeader, setDisplayHeader] = useState<Category>('SIGHTSEEING');

  const { items, isLoading, isError } = useItems(id)

  if (isLoading) return <div>Loading ...</div>
  if (isError) return <div>An error occured</div>

  const options = [
    { label: 'Sightseeing', value: 0 },
    { label: 'Food', value: 1 },
    { label: 'Activities', value: 2 },
    { label: 'Others', value: 3 },
  ];

  const handlePopUp = (show: boolean) => {
    let category: Category = 'SIGHTSEEING';
    switch (activeIndex) {
      case 0:
        category = "SIGHTSEEING";
        break;
      case 1:
        category = "FOOD";
        break;
      case 2:
        category = "ACTIVITIES";
        break;
      case 3:
        category = "OTHERS";
        break;
    }
    setDisplayHeader(category);
    setDisplay(show);
  }

  return (
    <div className='pt-4 select-none'>
      <div className="flex items-center justify-center mx-5">
        <CreateItemDialog planId={id} display={display} header={displayHeader} handlePopUp={handlePopUp}></CreateItemDialog>
        <p className='text-lg font-bold'>Places</p>
        <div className='flex-grow'></div>
        <SelectButton value={activeIndex} options={options} unselectable={false} onChange={(e) => setActiveIndex(e.value)}></SelectButton>
        <div className='flex-grow'></div>
        <Button icon="pi pi-plus" className="p-button-rounded" onClick={() => handlePopUp(true)}></Button>
      </div>
      <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header="Sightseeing">
          <div className="grid grid-cols-4 gap-4">
            {items != undefined && items?.filter((obj) => {
              return obj.category == "SIGHTSEEING"
            }).map((obj) => (
              <PlaceCard key={obj.id} item={obj}></PlaceCard>
            ))}
          </div>
        </TabPanel>
        <TabPanel header="Food">
          <div className="grid grid-cols-4 gap-4">
            {items != undefined && items?.filter((obj) => {
              return obj.category == "FOOD"
            }).map((obj) => (
              <PlaceCard key={obj.id} item={obj}></PlaceCard>
            ))}
          </div>
        </TabPanel>
        <TabPanel header="Activities">
          <div className="grid grid-cols-4 gap-4">
            {items != undefined && items?.filter((obj) => {
              return obj.category == "ACTIVITIES"
            }).map((obj) => (
              <PlaceCard key={obj.id} item={obj}></PlaceCard>
            ))}
          </div>
        </TabPanel>
        <TabPanel header="Others">
          <div className="grid grid-cols-4 gap-4">
            {items != undefined && items?.filter((obj) => {
              return obj.category == "OTHERS"
            }).map((obj) => (
              <PlaceCard key={obj.id} item={obj}></PlaceCard>
            ))}
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default PlaceList;