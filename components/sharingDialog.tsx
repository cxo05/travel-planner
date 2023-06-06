import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { NextPage } from "next";
import React from 'react';
import { useForm, Controller } from 'react-hook-form';

interface Props {
  planId: string
  visible: boolean
  onHide: () => void
}

interface formType {
  email: string
}

const defaultValues = {
  email: '',
}

const SharingDialog: NextPage<Props> = (props) => {
  const { planId, visible, onHide } = props;

  const { control, formState: { errors }, handleSubmit } = useForm({ defaultValues });

  const onSubmit = ({ email }: formType) => {
    fetch('/api/plan/share', {
      body: JSON.stringify({ email: email, planId: planId }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then((res) => {
      return res.json()
    }).then((data) => {
      onHide()
      // TODO Email Validation/Send Email
    })
  };

  const renderFooter = () => {
    return (
      <div>
        <Button label="Cancel" icon="pi pi-times" onClick={onHide} className="p-button-text" />
        <Button label="Share" icon="pi pi-share-alt" onClick={handleSubmit(onSubmit)} autoFocus />
      </div>
    );
  }

  return (
    <Dialog header={"Share"} visible={visible} style={{ width: '50vw' }} footer={renderFooter} onHide={() => { onHide() }}>
      <form className="p-fluid">
        <div className="field py-3">
          <span className="p-float-label">
            <Controller name="email" control={control} rules={{ required: 'Email is required.' }} render={({ field, fieldState }) => (
              <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
            )} />
            <label htmlFor="email" className={classNames({ 'p-error': errors.email })}>Email*</label>
          </span>
        </div>
      </form>
    </Dialog>
  )
};

export default SharingDialog;