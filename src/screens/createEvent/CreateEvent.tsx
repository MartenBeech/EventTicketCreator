import { StyleSheet, View, ScrollView, Image } from "react-native";
import { NavigationBar } from "../../NavigationBar";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Navigation";
import { TextInput } from "../../components/TextInput";
import { ImageUploader } from "../../components/ImageUploader";
import { useState } from "react";
import { TextArea } from "../../components/TextArea";
import { Button } from "../../components/Button";
import {
  DateTimePickerModal,
  dateTimeType,
} from "../../components/DateTimePicker";
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

  const [modalType, setModalType] = useState<dateTimeType>("");

  const onSubmit = () => {
    console.log(imageUri);
    console.log(title);
    console.log(location);
    console.log(startDate);
    console.log(startTime);
    console.log(endDate);
    console.log(endTime);
    console.log(description);
  };

  return (
    <View style={styles.screen}>
      <DateTimePickerModal
        setDateTime={
          modalType === "startDate"
            ? setStartDate
            : modalType === "startTime"
            ? setStartTime
            : modalType === "endDate"
            ? setEndDate
            : setEndTime
        }
        isVisible={!!modalType}
        setModalType={setModalType}
        mode={
          modalType === "startDate"
            ? "calendar"
            : modalType === "endDate"
            ? "calendar"
            : "time"
        }
        selectedValue={
          modalType === "startDate"
            ? startDate || convertUTCToYearMonthDate(new Date())
            : modalType === "endDate"
            ? endDate || convertUTCToYearMonthDate(new Date())
            : undefined
        }
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
              onPress={() => setModalType("startDate")}
            />
            <DateButton
              title="Start Time"
              value={startTime}
              onPress={() => setModalType("startTime")}
            />
            <DateButton
              title="End Date"
              value={endDate}
              onPress={() => setModalType("endDate")}
            />
            <DateButton
              title="End Time"
              value={endTime}
              onPress={() => setModalType("endTime")}
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
