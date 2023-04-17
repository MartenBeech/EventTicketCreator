import { useState } from "react";
import { Button } from "react-native";
import DatePickerRN from "react-native-modern-datepicker";

export const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useState("");

  return <DatePickerRN current="2020-07-13" selected="2020-07-23" />;
};
