import { NextPage } from "next";
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, UseFormRegister, UseFormSetValue, useForm } from 'react-hook-form';
import { Category, Item } from '@prisma/client';
import { useSWRConfig } from 'swr';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';

import { Autocomplete, GoogleMap, MarkerF, useGoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { classNames } from "primereact/utils";

interface Props {
  planId: string | string[] | undefined
  item: Item | undefined
  visible: boolean
  onHide: () => void
}

const categories = [
  { name: 'Sightseeing', value: Category.SIGHTSEEING },
  { name: 'Food', value: Category.FOOD },
  { name: 'Activities', value: Category.ACTIVITIES },
  { name: 'Others', value: Category.OTHERS },
];

const defaultValues = {
  name: '',
  place_id: '',
  notes: ''
}

const libraries: ("drawing" | "geometry" | "localContext" | "places" | "visualization")[] = ["places"]

const AddEditItemDialog: NextPage<Props> = (props) => {
  const { planId, item, visible, onHide } = props

  const { control, register, setValue, handleSubmit, reset } = useForm<Item>({ defaultValues })

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.GOOGLE_API_KEY || '',
    libraries: libraries
  })

  const [center, setCenter] = useState({
    lat: 41.39860674724766,
    lng: 2.1999917272411134,
  })

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
  }, [center])

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
      body: JSON.stringify({ name: newItem.name, placeId: newItem.placeId, notes: newItem.notes, category: newItem.category }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: item ? 'PUT' : 'POST'
    }).then((res) => {
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
    <Dialog header="Find a place to add" visible={visible} style={{ width: '80vw' }} footer={renderFooter} onHide={() => { onHide() }}>
      <div className="flex flex-column md:flex-row">
        <div className="w-full flex flex-column align-items-s justify-content-center gap-3">
          <form className="w-full">
            {isLoaded ?
              <GoogleMap
                mapContainerClassName="w-full h-[600px]"
                center={center}
                zoom={10}
                onLoad={onLoad}
              >
                <MapContent item={item} register={register} setValue={setValue} />
              </GoogleMap>
              :
              <ProgressSpinner />
            }
            <div className="field py-3">
              <span className="p-float-label">
                <InputText
                  id="notes"
                  className="w-full"
                  {...register("notes")}
                  autoFocus
                />
                <label htmlFor="notes">Notes</label>
              </span>
            </div>
            <div className="field py-3">
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Category is required.' }}
                render={({ field, fieldState }) => (
                  <Dropdown
                    id={field.name}
                    value={field.value}
                    optionLabel="name"
                    placeholder="Select a Category"
                    options={categories}
                    focusInputRef={field.ref}
                    onChange={(e) => field.onChange(e.value)}
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                )}
              />
            </div>
          </form>
        </div>
      </div>
    </Dialog >
  )
};

interface MapContentProps {
  item: Item | undefined
  setValue: UseFormSetValue<Item>
  register: UseFormRegister<Item>
}

function MapContent({ item, setValue, register }: MapContentProps) {
  const map = useGoogleMap()
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete>()
  const [marker, setMarker] = useState<google.maps.Marker>()
  const [place, setPlace] = useState<google.maps.places.PlaceResult>()

  useEffect(() => {
    if (!map) return;
    map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (!map) return

      let service = new google.maps.places.PlacesService(map);
      if (!("placeId" in e)) {
        return
      }

      service.getDetails({ placeId: e.placeId as string }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setValue("name", place!.name as string)
          setPlace(place!)
        }
      })
    })
  }, [map, setValue]);

  useEffect(() => {
    if (!map || !place || !marker) return

    map.setZoom(17);
    map.setCenter(place.geometry!.location!);

    marker.setPosition(place.geometry?.location)
    marker.setVisible(true)

    console.log(marker.getPosition()?.toString())

    setValue("placeId", place.place_id as string)
  }, [place, map, marker, setValue])

  useEffect(() => {
    if (!map) return
    if (item?.placeId) {
      let service = new google.maps.places.PlacesService(map);
      service.getDetails({ placeId: item.placeId }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setPlace(place!)
        }
      })
    }
  }, [item, map])

  const onPlaceChanged = () => {
    if (autocomplete != null && autocomplete != undefined) {
      const place = autocomplete.getPlace();
      setPlace(place)
    } else {
      alert("Please select a location");
    }
  }

  return (
    <>
      <Autocomplete
        onLoad={(a) => setAutocomplete(a)}
        onPlaceChanged={onPlaceChanged}
        options={{
          fields: ["name", "place_id", "geometry"]
        }}
      >
        <input
          type="text"
          placeholder="Search"
          {...register("name", { required: "Required" })}
          className="mt-5 outline-none rounded-md absolute left-1/2 text-ellipsis"
          style={{
            width: `240px`,
            height: `32px`,
            padding: `0 12px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            marginLeft: "-120px"
          }}
        />
      </Autocomplete>
      <MarkerF
        onLoad={(m) => {
          m.setMap(map);
          setMarker(m);
        }}
        position={{
          lat: 37.772,
          lng: -122.214
        }}
        visible={false}
      >
      </MarkerF>
    </>
  )
}

export default AddEditItemDialog;