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
} from "../../components/modals/DateTimePickerModal";
import { DateButton } from "../../components/DateButton";
import { uploadFileToPinata, uploadTicketEventToPinata } from "../../rest/ipfs";
import { TicketEvent } from "../../entities/ticketEvent";
import { getStoreValue } from "../../store";
import { key_username } from "../../constants";
import { createAssetTransaction } from "../../rest/algorand";
import {
  convertHourMinuteToUTC,
  convertYearMonthDateToUTC,
} from "../../service/dateTime";
import { Snackbar, SnackbarColor } from "../../components/Snackbar";
import { Spinner } from "../../components/Spinner";
import { FacebookSelectEventModal } from "../../components/modals/FacebookSelectEventModal";

import { LoginManager, AccessToken } from "react-native-fbsdk-next";

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
  const [snackBarText, setSnackBarText] = useState("");
  const [snackBarColor, setSnackBarColor] = useState<SnackbarColor>("green");
  const [isLoading, setIsLoading] = useState(false);
  const [isFacebookModalOpen, setIsFacebookModalOpen] = useState(false);

  const onSubmit = async () => {
    if (!imageUri || !title) {
      setSnackBarColor("red");
      setSnackBarText("Required field(s) missing");
      return;
    }
    setIsLoading(true);
    const IpfsCid = await uploadFileToPinata(imageUri);
    if (!IpfsCid) {
      setSnackBarColor("red");
      setSnackBarText("Failed uploading image to Pinata");
      setIsLoading(false);
      return;
    }
    const ticketEvent: TicketEvent = {
      creatorName: await getStoreValue(key_username),
      description,
      endDate: `${endDate} ${endTime}`,
      imageUrl: IpfsCid,
      location,
      price: 0,
      startDate: `${startDate} ${startTime}`,
      title,
    };
    const eventCID = await uploadTicketEventToPinata(ticketEvent);

    if (!eventCID) {
      setSnackBarColor("red");
      setSnackBarText("Failed uploading event to Pinata");
      setIsLoading(false);
      return;
    }
    const createAssetTransactionResult = await createAssetTransaction(
      title,
      `ipfs/${eventCID}`,
      100
    );
    if (!createAssetTransactionResult) {
      setSnackBarColor("red");
      setSnackBarText("Failed creating asset transaction");
      setIsLoading(false);
      return;
    }
    setSnackBarColor("green");
    setSnackBarText("Succesfully submitted event");
    setIsLoading(false);
  };

  const onImportFromFacebook = async () => {
    await loginWithFacebook();
    setIsFacebookModalOpen(true);
  };
  const onSubmitFacebook = async () => {};
  const onCancelFacebook = async () => {
    setIsFacebookModalOpen(false);
  };

  const loginWithFacebook = async () => {
    try {
      // NOTE: 'public_profile' and 'email' are default permissions, no need to add them
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);

      if (result.isCancelled) {
        console.log("User cancelled the login process");
        return;
      }

      console.log(
        "Login was successful with permissions:",
        result.grantedPermissions!!.toString()
      );

      // Get the access token
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        console.log("Something went wrong obtaining the access token");
        return;
      }

      const accessToken = data.accessToken.toString();
      // You can now use this access token to make API calls
    } catch (error) {
      console.log("Login failed with error:", error);
    }
  };

  return (
    <View style={styles.screen}>
      {isLoading && <Spinner />}
      <Snackbar
        textState={snackBarText}
        setTextState={setSnackBarText}
        backgroundColor={snackBarColor}
      />
      {modalType && (
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
          setModalType={setModalType}
          mode={
            modalType === "startDate"
              ? "date"
              : modalType === "endDate"
              ? "date"
              : "time"
          }
          selectedValue={
            modalType === "startDate"
              ? convertYearMonthDateToUTC(startDate)
              : modalType === "startTime"
              ? convertHourMinuteToUTC(startTime)
              : modalType === "endDate"
              ? convertYearMonthDateToUTC(endDate)
              : convertHourMinuteToUTC(endTime)
          }
          startDate={startDate}
        />
      )}
      <ScrollView>
        <FacebookSelectEventModal
          isVisible={isFacebookModalOpen}
          onCancel={onCancelFacebook}
          onConfirm={onSubmitFacebook}
        />
        <Button
          title="Import from facebook"
          onPress={() => onImportFromFacebook()}
        />
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
            <TextInput title="Title" setState={setTitle} required />
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
