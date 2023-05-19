import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { NextPage } from "next";
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Category, Item } from '@prisma/client';
import { useSWRConfig } from 'swr';

interface Props {
  planId: string | string[] | undefined
  item: Item | undefined
  visible: boolean
  category: Category
  onHide: () => void
}

const defaultValues = {
  name: '',
  notes: ''
}

const AddEditItemDialog: NextPage<Props> = (props) => {
  const { planId, item, visible, category, onHide } = props;

  const { control, formState: { errors }, handleSubmit, reset } = useForm<Item>({ defaultValues });

  // Feels a bit hacky, probably a better way to do this
  useEffect(() => {
    if (item) {
      reset(item);
    } else {
      reset(defaultValues);
    }
  }, [item, reset]);

  const { mutate } = useSWRConfig()

  const onSubmit = (newItem: Item) => {
    fetch(item ? `/api/item/${item.id}` : `/api/item?planId=${planId}`, {
      body: JSON.stringify({ name: newItem.name, notes: newItem.notes, category: category }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: item ? 'PUT' : 'POST'
    }).then((res) => {
      console.log(res);
      return res.json() as Promise<Item>
    }).then((data) => {
      mutate(`/api/item?planId=${planId}`)
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
    <Dialog header={category} visible={visible} style={{ width: '50vw' }} footer={renderFooter} onHide={() => { onHide() }}>
      <div className="grid p-fluid">
        <div className="field py-3">
          <span className="p-float-label">
            <Controller name="name" control={control} rules={{ required: 'Place is required.' }} render={({ field, fieldState }) => (
              <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
            )} />
            <label htmlFor="place" className={classNames({ 'p-error': errors.name })}>Place*</label>
          </span>
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

export default AddEditItemDialog;