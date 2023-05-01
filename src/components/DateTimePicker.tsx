import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import DatePicker from "react-native-modern-datepicker";

export type dateTimeType =
  | "startDate"
  | "startTime"
  | "endDate"
  | "endTime"
  | "";

interface Props {
  setDateTime: React.Dispatch<React.SetStateAction<string>>;
  isVisible: boolean;
  setModalType: React.Dispatch<React.SetStateAction<dateTimeType>>;
  mode: "calendar" | "time";
  selectedValue?: string;
}

export const DateTimePickerModal = (props: Props) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.isVisible}
      onRequestClose={() => {
        props.setModalType("");
      }}
    >
      <TouchableOpacity
        style={styles.screen}
        activeOpacity={1}
        onPressOut={() => {
          props.setModalType("");
        }}
      >
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <DatePicker
                mode={props.mode}
                minuteInterval={5}
                onTimeChange={(selectedTime) => {
                  props.setDateTime(selectedTime);
                  props.setModalType("");
                }}
                onDateChange={(selectedDate) => {
                  props.setDateTime(selectedDate);
                  props.setModalType("");
                }}
                selected={props.selectedValue}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    width: "80%",
    height: "50%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
  },
});
