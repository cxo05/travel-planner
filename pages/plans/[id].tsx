import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import PlaceList from '../../components/placeList'
import TimeLine from '../../components/timeline'

import SampleData from "../api/data.json";

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Button } from 'primereact/button'

const Plan = () => {
  const router = useRouter()
  const { pid } = router.query

  var id = parseInt(pid as string, 10);

  const plan = SampleData.Plans.at(id);

  const { data: session } = useSession()

  var tem = new Array();
  var startDate = new Date(plan!.startDate);
  var endDate = new Date(plan!.endDate);
  while (startDate <= endDate) {
    tem.push(new Date(startDate));
    startDate.setDate(startDate.getDate() + 1);
  }

  return (
    <main>
      <div>
        {session && session.user ? (
          <DndProvider backend={HTML5Backend}>
            <div className='inline-flex'>
              <Button icon="pi pi-home" rounded onClick={() => { window.location.href = "/"; }} />
              <div className="font-medium text-2xl pl-4">{plan?.title}</div>
            </div>
            <div>
              <TimeLine dates={tem}></TimeLine>
            </div>
            <div style={{ boxShadow: "0 -5px 5px -5px #333", position: "sticky", bottom: "0", backgroundColor: "white" }}>
              {plan ? <PlaceList places={plan.Locations}></PlaceList> : null}
            </div>
          </DndProvider>
        ) : (
          <p>You need to sign in to save your progress</p>
        )}
      </div>
    </main >
  )
}

export default Plan