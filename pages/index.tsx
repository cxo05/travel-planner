import type { NextPage } from 'next'
import { useSession } from "next-auth/react"
import { useState } from 'react'

import SampleData from "./api/data.json";

import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button'
import { DataTable, DataTableRowEditCompleteParams } from 'primereact/datatable';
import { Column, ColumnBodyOptions } from 'primereact/column'
import { InputText } from 'primereact/inputtext';
import { CalendarChangeParams } from "primereact/calendar";

import DatePicker from "../components/datePicker";

const Home: NextPage = () => {
  const { data: session } = useSession()

  const [plans, updatePlans] = useState(SampleData.Plans);

  //const { data, error, isLoading } = useSwr(`/api/user/${session?.user.id}`, fetcher)

  const breadcrumbMenu = [
    {
      label: 'Plans',
      command: () => { window.location.hash = "/"; },
    },
  ];

  const home = { icon: 'pi pi-home', command: () => { window.location.hash = "/"; } }


  const dateEditor = (options: any) => {
    return <DatePicker value={new Date(options.value)} onChange={(e: CalendarChangeParams) => {
      let date = e.value as Date;
      options.editorCallback(date.toLocaleDateString());
    }}></DatePicker>
  }

  const cellEditor = (options: any) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  }

  const onRowEditComplete = (e: DataTableRowEditCompleteParams) => {
    let _plans = [...plans];
    let { newData, index } = e;
    _plans[index] = newData;

    updatePlans(_plans);
  }

  const viewPlan = (columnProp: ColumnBodyOptions) => {
    window.location.href = "/plans/" + columnProp.rowIndex;
  }

  const buttonTemplate = (rowData: ColumnBodyOptions) => {
    return <Button className="p-button-rounded p-button-outlined" onClick={() => viewPlan(rowData)}>View</Button>;
  }

  return (
    <main>
      <BreadCrumb model={breadcrumbMenu} home={home} />
      <div>
        {session && session.user ? (
          <>
            <DataTable value={plans} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} responsiveLayout="scroll" autoLayout>
              <Column field="title" header="Title" editor={(options) => cellEditor(options)}></Column>
              <Column field="startDate" header="Start Date" editor={(options) => dateEditor(options)} ></Column>
              <Column field="endDate" header="End Date" editor={(options) => dateEditor(options)}></Column>
              <Column rowEditor bodyStyle={{ textAlign: 'right' }}></Column>
              <Column body={buttonTemplate} style={{ flex: '0 0 4rem' }}>
              </Column>
            </DataTable>
          </>
        ) : (
          <p>You need to sign in to save your progress</p>
        )}
      </div>
    </main >
  )
}

export default Home