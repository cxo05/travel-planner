import PlaceCard from './placeCard';
import { NextPage } from 'next';

import { TabView, TabPanel } from 'primereact/tabview';
import { useState } from 'react';

interface Props {
  places: string[];
}

const PlaceList: NextPage<Props> = (props) => {
  const { places } = props;

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className='mt-10'>
      <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header="Sightseeing">
          <div className="grid grid-cols-4 gap-4">
            {places.map((obj) => (
              <PlaceCard key={obj} name={obj}></PlaceCard>
            ))}
          </div>
        </TabPanel>
        <TabPanel header="Food">
          Content II
        </TabPanel>
        <TabPanel header="Activities">
          Content III
        </TabPanel>
        <TabPanel header="Others">
          Content III
        </TabPanel>
      </TabView>
    </div>
  );
};

export default PlaceList;