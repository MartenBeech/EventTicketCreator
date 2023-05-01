import { View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  convertUTCToHourMinute,
  convertUTCToYearMonthDate,
} from "../service/dateTime";

export type dateTimeType =
  | "startDate"
  | "startTime"
  | "endDate"
  | "endTime"
  | "";

interface Props {
  setDateTime: React.Dispatch<React.SetStateAction<string>>;
  setModalType: React.Dispatch<React.SetStateAction<dateTimeType>>;
  mode: "date" | "time";
  selectedValue: Date;
}

export const DateTimePickerModal = (props: Props) => {
  return (
    <View>
      <DateTimePicker
        mode={props.mode}
        minuteInterval={5}
        onChange={(value) => {
          if (value.type === "set") {
            const timestamp = value.nativeEvent.timestamp;
            if (timestamp) {
              const dateTime = new Date(timestamp);
              const dateTimeString =
                props.mode === "date"
                  ? convertUTCToYearMonthDate(dateTime)
                  : convertUTCToHourMinute(dateTime);
              props.setDateTime(dateTimeString);
            }
          }
          props.setModalType("");
        }}
        value={props.selectedValue}
      />
    </View>
  );
};
