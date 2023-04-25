import { StyleSheet, View, ScrollView, Image } from "react-native";
import { NavigationBar } from "../../NavigationBar";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Navigation";
import { TextInput } from "../../components/TextInput";
import { ImageUploader } from "../../components/ImageUploader";
import { useState } from "react";
import { TextArea } from "../../components/TextArea";
import { Button } from "../../components/Button";
import DatePicker from "react-native-modern-datepicker";
import { DateTimePickerModal } from "../../components/DateTimePicker";
import { DateButton } from "../../components/DateButton";
import { convertUTCToYearMonthDate } from "../../service/dateTime";

type NavigationRoute = NativeStackScreenProps<
  RootStackParamList,
  "CreateEvent"
>;

interface Props {
  navigation: NavigationRoute["navigation"];
  route: NavigationRoute["route"];
}

export const CreateEvent = (props: Props) => {
  const [imageUri, setImageUri] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");

  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [isStartDateModalVisible, setIsStartDateModalVisible] = useState(false);
  const [isStartTimeModalVisible, setIsStartTimeModalVisible] = useState(false);
  const [isEndDateModalVisible, setIsEndDateModalVisible] = useState(false);
  const [isEndTimeModalVisible, setIsEndTimeModalVisible] = useState(false);

  const onSubmit = () => {
    console.log(imageUri);
    console.log(title);
    console.log(location);
    console.log(startDate);
    console.log(endDate);
    console.log(description);
  };

  return (
    <View style={styles.screen}>
      <DateTimePickerModal
        setDateTime={setStartDate}
        isVisible={isStartDateModalVisible}
        setIsVisible={setIsStartDateModalVisible}
        mode="calendar"
        selectedValue={startDate || convertUTCToYearMonthDate(new Date())}
      />
      <DateTimePickerModal
        setDateTime={setStartTime}
        isVisible={isStartTimeModalVisible}
        setIsVisible={setIsStartTimeModalVisible}
        mode="time"
      />
      <DateTimePickerModal
        setDateTime={setEndDate}
        isVisible={isEndDateModalVisible}
        setIsVisible={setIsEndDateModalVisible}
        mode="calendar"
        selectedValue={endDate || convertUTCToYearMonthDate(new Date())}
      />
      <DateTimePickerModal
        setDateTime={setEndTime}
        isVisible={isEndTimeModalVisible}
        setIsVisible={setIsEndTimeModalVisible}
        mode="time"
      />
      <ScrollView>
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={
              imageUri
                ? { uri: imageUri }
                : require("../../images/ImagePlaceholder.jpg")
            }
          />
          <ImageUploader setImageUri={setImageUri} />
          <View style={styles.flexWrap}>
            <TextInput title="Title" setState={setTitle} />
            <TextInput title="Location" setState={setLocation} />
            <DateButton
              title="Start Date"
              value={startDate}
              setModalVisible={setIsStartDateModalVisible}
            />
            <DateButton
              title="Start Time"
              value={startTime}
              setModalVisible={setIsStartTimeModalVisible}
            />
            <DateButton
              title="End Date"
              value={endDate}
              setModalVisible={setIsEndDateModalVisible}
            />
            <DateButton
              title="End Time"
              value={endTime}
              setModalVisible={setIsEndTimeModalVisible}
            />
            <TextArea title="Description" setState={setDescription} />
          </View>
          <Button title="Submit" onPress={() => onSubmit()} />
        </View>
      </ScrollView>
      <NavigationBar navigation={props.navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    height: "100%",
  },
  container: {
    height: "90%",
    alignItems: "center",
  },
  button: {
    width: "100%",
    alignItems: "center",
  },
  flexWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  image: {
    height: 200,
    width: "100%",
    resizeMode: "cover",
  },
});
