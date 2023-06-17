import PlaceCard from './placeCard';
import AddEditItemDialog from './addEditItemDialog';

import { SelectButton } from 'primereact/selectbutton';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { Category, Item } from '@prisma/client';
import { useRouter } from 'next/router';
import { CalendarEvent, useItems } from '../lib/swr'
import { NextPage } from 'next';

interface Props {
  handleDragStart: (item: CalendarEvent) => void
  handleClose: () => void
}

const PlaceList: NextPage<Props> = (props) => {
  const { handleDragStart, handleClose } = props;

  const router = useRouter()
  const { id } = router.query

  const [activeCat, setActiveCat] = useState<Category | null>(null);
  const [visiblePopUp, setVisiblePopUp] = useState(false);

  const [editItem, setEditItem] = useState<Item | undefined>(undefined);

  const { items, isLoading, isError } = useItems(id)

  if (isLoading) return <div>Loading ...</div>
  if (isError) return <div>An error occured</div>

  const options = [
    { label: 'All', value: null },
    { label: 'Sightseeing', value: Category.SIGHTSEEING },
    { label: 'Food', value: Category.FOOD },
    { label: 'Activities', value: Category.ACTIVITIES },
    { label: 'Others', value: Category.OTHERS },
  ];

  const handleAddPopUp = () => {
    setEditItem(undefined);
    setVisiblePopUp(true);
  }

  const handleEditPopUp = (item: Item) => {
    setEditItem(item);
    setVisiblePopUp(true);
  }

  return (
    <div className='py-4 select-none'>
      <AddEditItemDialog planId={id} item={editItem} visible={visiblePopUp} onHide={() => setVisiblePopUp(false)}></AddEditItemDialog>
      <div className="flex items-center justify-center mx-5">
        <p className='text-lg font-bold'>Places</p>
        <div className='flex-grow'></div>
        <SelectButton value={activeCat} options={options} unselectable={false} onChange={(e) => setActiveCat(e.value)}></SelectButton>
        <Button icon="pi pi-plus" rounded className='ml-2' onClick={() => handleAddPopUp()}></Button>
        <div className='flex-grow'></div>
        <Button icon="pi pi-times" rounded text severity="secondary" onClick={handleClose}></Button>
      </div>
      <div id="customScroll" className="flex flex-nowrap overflow-x-auto gap-4 items-stretch p-4">
        {items != undefined && items?.filter((obj) => {
          if (!activeCat) return true
          return obj.category == activeCat
        }).map((obj) => (
          <PlaceCard key={obj.id} item={obj} handleEdit={handleEditPopUp} handleDragStart={handleDragStart}></PlaceCard>
        ))}
      </div>
    </div>
  );
};

export default PlaceList;