import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { NextPage } from "next";
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Plan } from '@prisma/client';
import { useRouter } from 'next/router';
import { useSWRConfig } from 'swr';

interface PlanProps {
  plan: Plan | undefined
  visible: boolean
  onHide: () => void
}

const PlanDialog: NextPage<PlanProps> = (props) => {
  const { plan, visible, onHide } = props;

  const { control, formState: { errors }, handleSubmit } = useForm<Plan>({});
  const { mutate } = useSWRConfig()
  const router = useRouter();

  const onSubmit = (newPlan: Plan) => {
    if (plan === undefined) {
      fetch('/api/plan', {
        body: JSON.stringify({ title: newPlan.title, location: newPlan.location, userId: newPlan.id }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }).then((res) => {
        return res.json() as Promise<Plan>
      }).then((data) => {
        router.push(`/plans/${data.id}`)
      })
    } else {
      fetch(`/api/plan/${plan?.id}`, {
        body: JSON.stringify({ title: newPlan.title, location: newPlan.location }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PUT'
      }).then((res) => {
        return res.json() as Promise<Plan>
      }).then((data) => {
        mutate(`/api/plan?planId=${plan?.id}`)
        onHide();
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
            <Controller name="title" control={control} rules={{ required: 'Name is required.' }} render={({ field, fieldState }) => (
              <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
            )} />
            <label htmlFor="title" className={classNames({ 'p-error': errors.title })}>{plan ? plan.title : "Plan Name*"}</label>
          </span>
        </div>
        <div className="field py-3">
          <span className="p-float-label">
            <Controller name="location" control={control} render={({ field, fieldState }) => (
              //@ts-ignore
              <InputText id={field.name} {...field} autoFocus />
            )} />
            <label htmlFor="location">{plan ? plan.location : "Location"}</label>
          </span>
        </div>
      </form>
    </Dialog>
  )
};

export default PlanDialog;