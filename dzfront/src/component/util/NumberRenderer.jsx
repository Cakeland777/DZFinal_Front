import React from "react";

function NumberRenderer(props) {
  const value = props.value || "";
  if (props.value !== undefined || null || 0) {
    const formattedValue = value.toLocaleString();

    return <span>{formattedValue}</span>;
  } else {
    return <span></span>;
  }
}

export default NumberRenderer;
