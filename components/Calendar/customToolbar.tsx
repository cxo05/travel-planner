import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { useRef, useState } from 'react';
import { ToolbarProps, Navigate as navigate } from 'react-big-calendar';

import EditPlanDialog from '../editPlanDialog'
import { Plan } from '@prisma/client';

const ViewNamesGroup = ({ views: viewNames, view, messages, onView }: any) => {
  return viewNames.map((name: any) => (
    <button
      type="button"
      key={name}
      className={`${view === name ? "rbc-active" : ""}`}
      onClick={() => onView(name)}
    >
      {messages[name]}
    </button>
  ))
}

interface CustomToolbarProps extends ToolbarProps {
  plan: Plan | undefined
}


const ToolbarComponent = ({
  label,
  localizer: { messages },
  onNavigate,
  onView,
  view,
  views,
  plan,
}: CustomToolbarProps
) => {
  const [visibleEditPopUp, setVisibleEditPopUp] = useState(false);
  const menuRight = useRef<Menu>(null); 

  const items = [
    {
      label: 'Options',
      items: [
        {
          label: 'Edit',
          icon: 'pi pi-pencil',
          command: () => {
            setVisibleEditPopUp(true);
          }
        },
        {
          label: 'Delete',
          icon: 'pi pi-times',
          command: () => {
            confirmDialog({
              message: 'Do you want to delete this plan?',
              header: 'Delete Confirmation',
              icon: 'pi pi-info-circle',
              acceptClassName: 'p-button-danger',
              accept: () => {
                fetch(`/api/plan/${plan?.id}`, {
                  method: 'DELETE'
                }).then((res) => {
                  return res.json()
                }).then(() => {
                  window.location.href = "/"
                })
              },
            });
          }
        }
      ]
    },
  ]

  return (
    <div className="rbc-toolbar">
      <EditPlanDialog plan={plan} visible={visibleEditPopUp} onHide={() => setVisibleEditPopUp(false)}></EditPlanDialog>
      <span className="rbc-btn-group">
        <ViewNamesGroup
          view={view}
          views={views}
          messages={messages}
          onView={onView}
        />
      </span>

      <span className="rbc-toolbar-label">{label}</span>

      <span className='rbc-btn-group'>
        <button
          type="button"
          onClick={() => onNavigate(navigate.PREVIOUS)}
          aria-label={messages.previous}
        >
          &#60;
        </button>
        <button
          type="button"
          onClick={() => onNavigate(navigate.TODAY)}
          aria-label={messages.today}
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => onNavigate(navigate.NEXT)}
          aria-label={messages.next}
        >
          &#62;
        </button>
      </span>

      <span className='rbc-btn-group'>
        <Menu
          model={items}
          popup
          ref={menuRight}
          id="popup_menu_right" />
        <ConfirmDialog />
        <Button
          icon="pi pi-ellipsis-v"
          className="ml-2"
          onClick={(event) => menuRight.current!.toggle(event)}
          aria-controls="popup_menu_right"
          aria-haspopup />
      </span>
    </div>
  )
}

export default ToolbarComponent