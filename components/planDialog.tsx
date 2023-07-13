import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { NextPage } from "next";
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Plan } from '@prisma/client';
import { useRouter } from 'next/router';
import { useSWRConfig } from 'swr';
import { Calendar } from 'primereact/calendar';

interface PlanProps {
  plan?: Plan
  visible: boolean
  onHide: () => void
}

const defaultValues = {
  title: '',
  location: '',
  startDate: new Date()
}

const PlanDialog: NextPage<PlanProps> = (props) => {
  const { plan, visible, onHide } = props;

  const { control, formState: { errors }, handleSubmit, reset } = useForm<Plan>({ defaultValues });
  const { mutate } = useSWRConfig()
  const router = useRouter();

  useEffect(() => {
    if (plan) {
      reset(plan);
    } else {
      reset(defaultValues);
    }
  }, [plan, reset]);

  const onSubmit = (newPlan: Plan) => {
    if (plan) {
      fetch(`/api/plan/${plan?.id}`, {
        body: JSON.stringify({
          title: newPlan.title,
          startDate: newPlan.startDate,
          location: newPlan.location
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PUT'
      }).then((res) => {
        return res.json() as Promise<Plan>
      }).then((data) => {
        mutate(`/api/plan/${plan?.id}`)
        onHide();
      })
    } else {
      fetch('/api/plan', {
        body: JSON.stringify({
          title: newPlan.title,
          startDate: newPlan.startDate,
          location: newPlan.location,
          userId: newPlan.id
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }).then((res) => {
        return res.json() as Promise<Plan>
      }).then((data) => {
        router.push(`/plans/${data.id}`)
      })
    }
  };

  const renderFooter = () => {
    return (
      <div>
        <Button label="Cancel" icon="pi pi-times" onClick={onHide} className="p-button-text" />
        <Button label="Confirm" icon="pi pi-check" onClick={handleSubmit(onSubmit)} autoFocus />
      </div>
    );
  }

  return (
    <Dialog header={plan ? "Edit" : "Add New Plan"} visible={visible} style={{ width: '50vw' }} footer={renderFooter} onHide={() => { onHide() }}>
      <form className="p-fluid">
        <div className="field py-3">
          <span className="p-float-label">
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Name is required.' }}
              render={({ field, fieldState }) => (
                <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
              )} />
            <label htmlFor="title" className={classNames({ 'p-error': errors.title })}>Plan Name*</label>
          </span>
        </div>
        <div className="field py-3">
          <span className="p-float-label">
            <Controller
              name="startDate"
              control={control}
              rules={{ required: 'Start date is required.' }}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name}>Start Date</label>
                  <Calendar
                    selectionMode="single"
                    inputId={field.name}
                    value={field.value}
                    //@ts-ignore
                    onChange={field.onChange}
                    dateFormat="dd/mm/yy"
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                </>
              )} />
          </span>
        </div>
        <div className="field py-3">
          <span className="p-float-label">
            <Controller
              name="location"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <InputText id={field.name} value={field.value || ''} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} autoFocus />
                  <label htmlFor={field.name}>Location</label>
                </>
              )} />
          </span>
        </div>
      </form>
    </Dialog>
  )
};

export default PlanDialog;