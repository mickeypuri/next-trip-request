"use client";

import { useState } from "react";

import RequestForm from "./RequestForm";
import RouteMap from "./RouteMap";

const TripRequest = () => {
  const [originLat, setOriginLat] = useState(null);
  const [originLng, setOriginLng] = useState(null);

  const [destLat, setDestLat] = useState(null);
  const [destLng, setDestLng] = useState(null);

  const props = {
    originProps: {
      searchLat: originLat,
      setSearchLat: setOriginLat,
      searchLng : originLng,
      setSearchLng: setOriginLng
    },
    destProps: {
      searchLat: destLat,
      setSearchLat: setDestLat,
      searchLng: destLng,
      setSearchLng: setDestLng
    }
  };

  const routeProps ={
      originLat,
      originLng,
      destLat,
      destLng
  };

  return (
    <div className="flex">
      <div className="w-1/5">
        <RequestForm {...props} />
      </div>
      <div className="w-4/5">
       <RouteMap {...routeProps}  />
      </div>
    </div>
  )
};

export default TripRequest;
