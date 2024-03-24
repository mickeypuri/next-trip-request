"use client";

import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF, DirectionsRenderer } from '@react-google-maps/api';
import { db } from "@/lib/db";
import StarRating from "./StarRating";

export default function DetailMap({ request, }) {

  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);
  const [radius_meters, setRadiusMeters] = useState(5000);
  const [drivers, setDrivers] = useState([]);
  const [driverMarker, setDriverMarker] = useState(null);

  //Directions data
  const [directions, setDirections] = useState(null);
  const [directionsDriver, setDirectionsDriver] = useState(null);
  const [driverLatLng, setDriverLatLng] = useState(null);
  const [driverDistance, setDriverDistance] = useState(null);
  const [driverDuration, setDriverDuration] = useState(null);

  const isLoaded = typeof google === 'object' && typeof google.maps === 'object';

  const mapRef = useRef(null);

  const { origin, destination } = request;
  const mOrigin = origin.match(/POINT\(([^ ]+) ([^ ]+)\)/);
  const mDest = destination.match(/POINT\(([^ ]+) ([^ ]+)\)/);

  const originLng = parseFloat(mOrigin[1]);
  const originLat = parseFloat(mOrigin[2]);

  const destLng = parseFloat(mDest[1]);
  const destLat = parseFloat(mDest[2]);

  const containerStyle = {
    width: '100%',
    height: '90vh'
  };

  const options = {
    mapId: "75f02676a5a8b183",
    mapTypeControl: false,
    zoomControl: false,
    fullscreenControl: false,
    clickableIcons: false,
    scrollwheel: true,
    streetViewControl: false,
  }

  const center = {
    lat: 51.50019165583299,
    lng: -0.12755559487881274
  };

  const carIcon = {
    url: "/assets/car.png",
    scaledSize: {
      width: 30,
      height: 30
    }
  };

  /*   const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API
    }) */

  useEffect(() => {
    if (request) {
      console.log("[DetailMap] request: ", request);
    }
  }, [request])

  const panToUserPosition = (lat, lng) => {
    const position = {
      lat,
      lng
    };
    const map = mapRef.current;
    if (map) {
      map.panTo(position);
    }
  };

  useEffect(() => {
    if (originLat && originLng) {
      panToUserPosition(originLat, originLng);
    }
  }, [originLat, originLng])

  // Request directions
  useEffect(() => {
    if (originLat && originLng && destLat && destLng) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: originLat, lng: originLng },
          destination: { lat: destLat, lng: destLng },
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result) => {
          console.log(result);
          setDirections(result);
        }
      );
    }
  }, [originLat, originLng, destLat, destLng])

  // Driver directions
  useEffect(() => {
    if (originLat && originLng && driverLatLng) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: originLat, lng: originLng },
          destination: driverLatLng,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result) => {
          console.log(result);
          setDirectionsDriver(result);
          setDriverDistance(result.routes[0].legs[0].distance.text);
          setDriverDuration(result.routes[0].legs[0].duration.text);
        }
      );
    }
  }, [originLat, originLng, driverLatLng])

  useEffect(() => {
    if (request.id && radius_meters) {
      async function getDrivers() {
        let _error;
        try {
          const { data, error } = await db.rpc("get_nearby_drivers",
            {
              request_id: request.id,
              radius_meters
            });

          if (!error) {
            //console.log("[DetailMap] nearbyDrivers: ", data);
            setDrivers(data);
          }
          else {
            _error = error;
          }
        } catch (error) {
          _error = error;
        }
        throw new Error(_error.message);
      }
      getDrivers();
    }
  }, [request.id, radius_meters])

  const getCoords = (str) => {
    const regex = /POINT\((-?\d+\.\d+)\s(-?\d+\.\d+)\)/;
    const matches = str.match(regex);

    if (matches && matches.length === 3) {
      const [, lng, lat] = matches;
      return {
        lng: parseFloat(lng),
        lat: parseFloat(lat),
      };
    }
    return null;
  };

  const handleClickedMarker = (id, driverPosition) => {
    if (id !== driverMarker) {
      setDriverMarker(id);
      setDriverLatLng(driverPosition);
    }
  };

  return isLoaded ? (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        options={options}
        onClick={() => setDriverMarker("")}
        onLoad={(map) => mapRef.current = map}
      >
        { /* Child components, such as markers, info windows, etc. */}
        {originLat && originLng &&
          <MarkerF
            position={{ lat: originLat, lng: originLng }}
          />
        }
        {destLat && destLng &&
          <MarkerF
            position={{ lat: destLat, lng: destLng }}
          />
        }

        {/* Direction renderer for request */}
        {directions &&
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "red",
                strokeWeight: 4,
                strokeOpacity: 1
              }
            }}
          />
        }

        {/* Direction renderer for driver */}
        {directionsDriver &&
          <DirectionsRenderer
            directions={directionsDriver}
            options={{
              polylineOptions: {
                strokeColor: "green",
                strokeWeight: 5,
                strokeOpacity: 1
              }
            }}
          />
        }

        {/* Displaying the drivers as markers  */}
        {drivers.map(({ id, driver_position, driver_username, driver_rating }) => {
          const driverPosition = getCoords(driver_position);
          const showInfo = driverMarker === id;
          return <MarkerF
            key={id}
            position={driverPosition}
            icon={carIcon}
            onClick={() => handleClickedMarker(id, driverPosition)}
          >
            { showInfo && <InfoWindowF
              onCloseClick={() => setIsInfoWindowOpen(false)}
              position={driverPosition}
            >
              <div className="w-80 p-2">
                <div className="flex items-center mb-2 space-x-5">
                  <img
                    src="https://images.unsplash.com/photo-1696928634052-41aa345ef686?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    className="w-14 h-14 rounded-full"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{ driver_username }</h3>
                    <p>{ driver_rating }</p>
                    <StarRating rating={driver_rating} />
                  </div>
                </div>
                <p>
                  <span className="font-bold">{driverDistance}</span> away
                </p>
                <p>
                  Will be here in <span className="font-bold">{driverDuration}</span>
                </p>
              </div>
            </InfoWindowF>}
          </MarkerF>;
        })}

        <></>
      </GoogleMap>
      <div className="flex items-center space-x-2 absolute top-2 left-4 w-1/4 h-10 ">
        <input
          placeholder="enter radius (meters)"
          type="number"
          className="w-1/2 h-full p-2 bg-gray-600 text-white"
          value={radius_meters}
          onChange={(e) => setRadiusMeters(e.target.value)}
        />
        <button
          className="bg-blue-500 px-4 py-2 text-white font-bold rounded-full"
        >
          {drivers.length} drivers
        </button>
      </div>
    </div>
  ) : <></>;

}
