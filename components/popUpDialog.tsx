import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { NextPage } from "next";
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Category, Item } from '@prisma/client';
import { useRouter } from 'next/router';

interface Props {
  display: boolean;
  header: Category,
  handlePopUp: (show: boolean) => void;
}

const PopUpDialog: NextPage<Props> = (props) => {
  const { display, header, handlePopUp } = props;

  const defaultValues = {
    name: '',
    notes: ''
  }

  const router = useRouter()
  const { id } = router.query

  const { control, formState: { errors }, handleSubmit } = useForm({ defaultValues });

  const onSubmit = (data: { name: string; notes: string; }) => {
    let category: Category = header;

    fetch('/api/item', {
      body: JSON.stringify({ planId: id, name: data.name, notes: data.notes, category: category }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then((res) => {
      return res.json() as Promise<Item>
    }).then((data) => {
      console.log(data);
      hidePopUp();
    })
  };

  const renderFooter = () => {
    return (
      <div>
        <Button label="Cancel" icon="pi pi-times" onClick={hidePopUp} className="p-button-text" />
        <Button label="Confirm" icon="pi pi-check" onClick={handleSubmit(onSubmit)} autoFocus />
      </div>
    );
  }

  //   const getFormErrorMessage = (name) => {
  //     return errors[name] && <small className="p-error">{errors[name].message}</small>
  // };

  const hidePopUp = () => {
    handlePopUp(false);
  }

  return (
    <Dialog header={header} visible={display} style={{ width: '50vw' }} footer={renderFooter} onHide={hidePopUp}>
      <div className="grid p-fluid">
        <div className="field py-3">
          <span className="p-float-label">
            <Controller name="name" control={control} rules={{ required: 'Place is required.' }} render={({ field, fieldState }) => (
              <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
            )} />
            <label htmlFor="place" className={classNames({ 'p-error': errors.name })}>Place*</label>
          </span>
          {/* {getFormErrorMessage('name')} */}
        </div>

        <div className="field py-3">
          <span className="p-float-label">
            <Controller name="notes" control={control} render={({ field }) => (
              <InputText id={field.name} {...field} autoFocus />
            )} />
            <label htmlFor="description">Description</label>
          </span>
        </div>
      </div>
    </Dialog>
  )
};

export default PopUpDialog;