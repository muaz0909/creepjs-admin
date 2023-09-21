import React, { useEffect, useState } from "react";
import Map from "./Map";

const LocationInfo = (props) => {
  return (
    <div class="data my-3 py-5 px-5">
      <div class="row">
        <div class=" col-6">
          <strong>Location</strong>
          <div
            class="block-text help"
            title="Date Date.getTimezoneOffset Intl.DateTimeFormat"
          >
            IP: {props.ipInfoCurrent?.ip}
            <br />
            City: {props.ipInfoCurrent?.city}
            <br />
            Region: {props.ipInfoCurrent?.region}
            <br />
            Country: {props.ipInfoCurrent?.country}
            <br />
            Location: {props.ipInfoCurrent?.loc}
            <br />
            Postal: {props.ipInfoCurrent?.postal}
            <br />
            Timezone: {props.ipInfoCurrent?.timezone}
          </div>
        </div>
        <div className="col-6">
          {props.ipInfoCurrent?.loc && (
            <Map location={props.ipInfoCurrent?.loc.split(",")} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationInfo;
