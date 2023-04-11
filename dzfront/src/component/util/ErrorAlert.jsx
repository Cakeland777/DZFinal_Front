import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function ErrorAlert(props) {
  const [error, setError] = useState("");

  useEffect(() => {
    if (props.error !== "") {
      Swal.fire("", `${props.error}`, "error");
      setError(props.error);
    }
  }, [props.error]);

  return error !== "" ? null : "";
}

export default ErrorAlert;
