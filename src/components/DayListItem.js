import React from "react";
import classnames from "classnames";

import "components/DayListItem.scss";

export default function DayListItem(props) {
  const dayClass = classnames("day-list__item", {
    'day-list__item--selected': props.selected,
    'day-list__item--full': props.spots === 0
  });

  const formatSpots = function(numOfSpots) { 
    if (numOfSpots === 0) {
      return 'no spots remaining';
    } else if (numOfSpots === 1) {
      return `${props.spots} spot remaining`;
    } else if (numOfSpots > 1) {
      return `${props.spots} spots remaining`;
    }
  }
  
  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2>{props.name}</h2>
      <h3>{formatSpots(props.spots)}</h3>
    </li>
  );
}
