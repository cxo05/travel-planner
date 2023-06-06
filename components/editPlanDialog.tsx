import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { NextPage } from "next";
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Plan } from '@prisma/client';
import { useSWRConfig } from 'swr';

interface EditPlanProps {
  plan: Plan | undefined
  visible: boolean
  onHide: () => void
}

const EditPlanDialog: NextPage<EditPlanProps> = (props) => {
  const { plan, visible, onHide } = props;

  const { control, formState: { errors }, handleSubmit, reset } = useForm<Plan>({ });
  const { mutate } = useSWRConfig()

  const onSubmit = (editPlan: Plan) => {
    fetch(`/api/plan/${plan?.id}`, {
      body: JSON.stringify({ title: editPlan.title }),
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
    <Dialog header={"Edit"} visible={visible} style={{ width: '50vw' }} footer={renderFooter} onHide={() => { onHide() }}>
      <form className="p-fluid">
        <div className="field py-3">
          <span className="p-float-label">
            <Controller name="title" control={control} rules={{ required: 'Name is required.' }} render={({ field, fieldState }) => (
              <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
            )} />
            <label htmlFor="name" className={classNames({ 'p-error': errors.title })}>{plan?.title}</label>
          </span>
        </div>
      </form>
    </Dialog>
  )
};

export default EditPlanDialog;