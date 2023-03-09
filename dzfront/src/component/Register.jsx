
import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko';
import "react-datepicker/dist/react-datepicker.css";
const Register = () => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <DatePicker
    showIcon
    selected={startDate}
    onChange={(date) => setStartDate(date)}
  />
  );
};

export default Register;
