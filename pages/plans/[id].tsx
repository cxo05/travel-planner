import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { BreadCrumb } from 'primereact/breadcrumb'
import { useState } from 'react'
import DatePicker from '../../components/datePicker'
import PlaceList from '../../components/placeList'
import TimeLine from '../../components/timeline'

import SampleData from "../api/data.json";

const Plan = () => {
  const router = useRouter()
  const { pid } = router.query

  var id = parseInt(pid as string, 10);

  const plan = SampleData.Plans.at(id);

  const { data: session } = useSession()

  let [daysNum, setDaysNum] = useState(0)

  const breadcrumbMenu = [
    {
      label: 'Plans',
      command: () => { window.location.href = "/"; },
    },
    {
      label: plan?.title,
      command: () => { window.location.href = "/plans/" + id; }
    },

  ];

  const home = { icon: 'pi pi-home', command: () => { window.location.href = "/"; } }

  return (
    <main>
      <BreadCrumb model={breadcrumbMenu} home={home} />
      <div>
        {session && session.user ? (
          <>
            <div>
              <p>Select Days</p>
              <DatePicker getDaysNum={setDaysNum}></DatePicker>
              <TimeLine daysNum={daysNum}></TimeLine>
            </div>
            {plan ? <PlaceList places={plan.Locations}></PlaceList> : null}
          </>
        ) : (
          <p>You need to sign in to save your progress</p>
        )}
      </div>
    </main >
  )
}

export default Plan