import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import { NavigationBar } from "../../NavigationBar";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Navigation";
import { TextInput } from "../../components/TextInput";
import { ImageUploader } from "../../components/ImageUploader";
import { useState } from "react";
import { NumberInput } from "../../components/NumberInput";
import { TextArea } from "../../components/TextArea";
import { DatePicker } from "../../components/DatePicker";

type NavigationRoute = NativeStackScreenProps<
  RootStackParamList,
  "CreateEvent"
>;

interface Props {
  navigation: NavigationRoute["navigation"];
  route: NavigationRoute["route"];
}

export const CreateEvent = (props: Props) => {
  const [image, setImage] = useState("");
  return (
    <View style={styles.screen}>
      <ScrollView>
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={
              image
                ? { uri: image }
                : require("../../images/ImagePlaceholder.jpg")
            }
          />
          <ImageUploader />
          <View style={styles.flexWrap}>
            <TextInput title="Title" />
            <TextInput title="Location" />
            <TextInput title="Start Date" />
            <TextInput title="End Date" />
            <TextArea title="Description" />
          </View>
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
