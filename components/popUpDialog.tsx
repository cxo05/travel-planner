import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { NextPage } from "next";
import React from 'react';
import { useForm, Controller } from 'react-hook-form';

interface Props {
  display: boolean;
  header: string,
  handlePopUp: (show: boolean) => void;
  addNewPlace: (data: { name: string; notes: string; category: string; }) => void;
}

const PopUpDialog: NextPage<Props> = (props) => {
  const { display, header, handlePopUp, addNewPlace } = props;

  const defaultValues = {
    place: '',
    description: ''
  }

  const { control, formState: { errors }, handleSubmit } = useForm({ defaultValues });

  const onSubmit = (data: { place: string; description: string; }) => {
    let category = "";
    switch (header) {
      case "Sightseeing":
        category = "SIGHTSEEING";
        break;
      case "Food":
        category = "FOOD";
        break;
      case "Activities":
        category = "ACTIVITIES";
        break;
      case "Others":
        category = "OTHERS";
        break;
      default:
        break;
    }
    addNewPlace({ name: data.place, notes: data.description, category: category });
    hidePopUp();
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
            <Controller name="place" control={control} rules={{ required: 'Place is required.' }} render={({ field, fieldState }) => (
              <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
            )} />
            <label htmlFor="place" className={classNames({ 'p-error': errors.place })}>Place*</label>
          </span>
          {/* {getFormErrorMessage('name')} */}
        </div>

        <div className="field py-3">
          <span className="p-float-label">
            <Controller name="description" control={control} render={({ field }) => (
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