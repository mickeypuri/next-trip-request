"use client";

import React, { useState, useRef, useEffect } from "react";

import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF, DirectionsRenderer } from '@react-google-maps/api';

export default function RouteMap({
  originLat,
  originLng,
  destLat,
  destLng
}) {

  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);

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

/*   const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API
  }) */

  const isLoaded = typeof google === 'object' && typeof google.maps === 'object';

  const mapRef = useRef(null);

  const panToUserPosition = (lat, lng) => {
    const position = {
      lat,
      lng
    };
    const map = mapRef.current;
    map.panTo(position);
  };

  useEffect(() => {
    if (originLat && originLng) {
      panToUserPosition(originLat, originLng);
    }
  }, [originLat, originLng])

  useEffect(() => {
    if (destLat && destLng) {
      panToUserPosition(destLat, destLng);
    }
  }, [destLat, destLng])

  // Directions data
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (originLat && originLng && destLat && destLng)
    {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: originLat, lng: originLng},
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

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        options={options}
        onClick={() => setIsInfoWindowOpen(false)}
        onLoad={(map) => mapRef.current = map}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        {originLat && originLng && 
          <MarkerF
            position={{lat: originLat, lng: originLng}}
          />
        }
        {destLat && destLng && 
          <MarkerF
            position={{lat: destLat, lng: destLng}}
          />
        }

        {/* Direction renderer */}
        {directions && 
          <DirectionsRenderer 
            directions={directions} 
            options = {{polylineOptions: {
              strokeColor: "red",
              strokeWeight: 4,
              strokeOpacity: 1
            }}} 
          />
        }

        <></>
      </GoogleMap>
  ) : <></>;

}
