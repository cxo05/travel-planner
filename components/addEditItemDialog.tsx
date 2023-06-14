import { NextPage } from "next";
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Category, Item } from '@prisma/client';
import { useSWRConfig } from 'swr';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import { Autocomplete, GoogleMap, useJsApiLoader } from '@react-google-maps/api';

interface Props {
  planId: string | string[] | undefined
  item: Item | undefined
  visible: boolean
  category: Category
  onHide: () => void
}

const defaultValues = {
  name: '',
  place_id: '',
  notes: ''
}

const libraries: ("drawing" | "geometry" | "localContext" | "places" | "visualization")[] = ["places"]

const AddEditItemDialog: NextPage<Props> = (props) => {
  const { planId, item, visible, category, onHide } = props

  const { register, setValue, handleSubmit, reset } = useForm<Item>({ defaultValues })

  const [map, setMap] = useState<any>(null)

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.GOOGLE_API_KEY || '',
    libraries: libraries
  })

  const [center, setCenter] = useState({
    lat: 41.39860674724766,
    lng: 2.1999917272411134,
  })


  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete>()

  const [marker, setMarker] = useState<google.maps.Marker>()

  const onLoad = useCallback((map: google.maps.Map) => {
    // If editing, set to previous address center
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [center])

  const onAutocompleteLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    console.log("Loaded")
    setAutocomplete(autocomplete)
  }, [])

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    let service = new google.maps.places.PlacesService(map);
    if (!("placeId" in e)) {
      return
    }

    service.getDetails({ placeId: e.placeId as string }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        locationSelected(place!)
      }
    })
  }

  const onPlaceChanged = () => {
    if (autocomplete != null && autocomplete != undefined) {
      const place = autocomplete.getPlace();
      locationSelected(place)
    } else {
      alert("Please select a location");
    }
  }

  function locationSelected(place: google.maps.places.PlaceResult) {
    map.setZoom(15);
    map.setCenter(place.geometry?.location);

    if (marker == undefined) {
      setMarker(new google.maps.Marker())
    }

    marker!.setMap(map)
    marker!.setPosition(place.geometry?.location)

    setMarker(marker)
    setValue("placeId", place.place_id as string)
  }

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
    console.log(newItem)
    fetch(item ? `/api/item/${item.id}` : `/api/item?planId=${planId}`, {
      body: JSON.stringify({ name: newItem.name, placeId: newItem.placeId, notes: newItem.notes, category: category }),
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
    <Dialog header={category} visible={visible} style={{ width: '80vw' }} footer={renderFooter} onHide={() => { onHide() }}>
      <div className="flex flex-column md:flex-row">
        <div className="w-full flex flex-column align-items-s justify-content-center gap-3 py-5">
          <form className="w-full">
            <GoogleMap
              mapContainerClassName="w-full h-[600px]"
              center={center}
              zoom={10}
              onLoad={onLoad}
              onClick={onMapClick}
              onUnmount={() => setMap(undefined)}
            >
              <Autocomplete
                onLoad={onAutocompleteLoad}
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
            </GoogleMap>
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
          </form>
        </div>
      </div>
    </Dialog >
  )
};

export default AddEditItemDialog;