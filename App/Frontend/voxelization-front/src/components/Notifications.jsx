import PropTypes from "prop-types";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";

export function Notifications() {
  const [errors, setErrors] = useState([]);
  // Estilos de la notificación
  injectStyle();

  const notify = () => {
    toast.error("🦄 Wow so easy!", {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return <ToastContainer>{notify()}</ToastContainer>;
}
