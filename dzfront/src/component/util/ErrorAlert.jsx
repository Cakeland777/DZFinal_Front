import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function ErrorAlert({ error }) {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (error && error.length > 0) {
      setShowAlert(true);
    }
  }, [error]);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  if (!showAlert) {
    return null;
  }

  Swal.fire({
    icon: "error",
    title: "에러 발생",
    text: error[error.length - 1],
  }).then(() => {
    handleCloseAlert();
  });

  return null;
}

export default ErrorAlert;
