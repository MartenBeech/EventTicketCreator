import { StyleSheet, View, ScrollView, Image } from "react-native";
import { NavigationBar } from "../../NavigationBar";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Navigation";
import { TextInput } from "../../components/TextInput";
import { ImageUploader } from "../../components/ImageUploader";
import { useState } from "react";
import { TextArea } from "../../components/TextArea";
import { Button } from "../../components/Button";

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
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

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
            <TextInput title="Start Date" setState={setStartDate} />
            <TextInput title="End Date" setState={setEndDate} />
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
