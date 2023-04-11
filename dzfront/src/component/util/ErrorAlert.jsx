import React from "react";
import Swal from "sweetalert2";

function ErrorAlert({ error }) {
  if (error) {
    Swal.fire(`${error}`, "", "error");
  }
  return null;
}

export default ErrorAlert;
