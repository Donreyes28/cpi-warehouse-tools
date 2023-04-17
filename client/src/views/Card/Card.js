import React from "react";

import "./Card.css";

const myCard = (props) => {
  const classes = "card " + props.className;
  return <div className={classes}>{props.children}</div>;
}
export default myCard;