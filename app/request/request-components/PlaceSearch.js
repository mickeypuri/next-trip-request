"use client";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import { useEffect, useState } from "react";

export default function PlaceSearch ({
  searchLat,
  setSearchLat,
  searchLng,
  setSearchLng,
  placeholder
}) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
      //componentRestrictions: { country: "gb"},

      locationRestriction: {
        east: 0.3207334331714769,  // long of eastern boundary
        north: 51.84818547136668,   // lat of north boundary
        south: 51.08336021402928,   // lat of southern boundary
        west: -0.8410706881891683   // lng of north boundary
      }
    },
    debounce: 300,
  });
  const ref = useOnclickOutside(() => {
    // When the user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }) =>
    () => {
      // When the user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      clearSuggestions();

      // Get latitude and longitude via utility functions
      getGeocode({ address: description }).then((results) => {
        const { lat, lng } = getLatLng(results[0]);
        console.log("📍Set Search Coordinates: ", { lat, lng });
        
        setSearchLat(lat);
        setSearchLng(lng);
      });
  };

  useEffect(() => {
    if (searchLat && searchLng) {
      console.log(`Retrieved latitude ${searchLat} and longitude ${searchLng}`);
    }
  }, [searchLat, searchLng])

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li className="bg-blue-100 my-2 cursor-pointer" key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <div ref={ref}>
      <input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder={ placeholder }
        className="bg-black my-2 h-10 rounded-xl px-2 text-white font-bold w-full"
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && <ul>{renderSuggestions()}</ul>}
    </div>
  );
}