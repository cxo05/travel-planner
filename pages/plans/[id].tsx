import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { BreadCrumb } from 'primereact/breadcrumb'
import PlaceList from '../../components/placeList'
import TimeLine from '../../components/timeline'

import SampleData from "../api/data.json";

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const Plan = () => {
  const router = useRouter()
  const { pid } = router.query

  var id = parseInt(pid as string, 10);

  const plan = SampleData.Plans.at(id);

  const { data: session } = useSession()

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

  var tem = new Array();
  var startDate = new Date(plan!.startDate);
  var endDate = new Date(plan!.endDate);
  while (startDate <= endDate) {
    tem.push(new Date(startDate));
    startDate.setDate(startDate.getDate() + 1);
  }

  const home = { icon: 'pi pi-home', command: () => { window.location.href = "/"; } }

  return (
    <main>
      <BreadCrumb model={breadcrumbMenu} home={home} />
      <div>
        {session && session.user ? (
          <DndProvider backend={HTML5Backend}>
            <div style={{ fontWeight: "400", fontSize: "30px" }}>{plan?.title}</div>
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