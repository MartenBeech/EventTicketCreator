import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Button,
  Image,
} from "react-native";
import { NavigationBar } from "../../NavigationBar";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Navigation";
import { getStoreValue } from "../../store";
import { key_address, key_mnemonic, key_username } from "../../constants";
import { createAssetTransaction } from "../../rest/algorand";
import { getFileFromPinata } from "../../rest/ipfs";
import { useState } from "react";
import { IPFSUrlPrefix } from "../../../env";

type NavigationRoute = NativeStackScreenProps<RootStackParamList, "MyEvents">;

interface Props {
  navigation: NavigationRoute["navigation"];
  route: NavigationRoute["route"];
}

export const MyEvents = (props: Props) => {
  const [image, setImage] = useState("");
  const logMyChildren = async () => {
    const response = await createAssetTransaction(
      "test asset 2",
      "asset url 2",
      1001
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView>
        <View style={styles.container}>
          <Text>My Events</Text>
          <Button
            title="Click Me"
            onPress={async () => {
              setImage(
                await getFileFromPinata(
                  "QmVkTTyAtX55uMtHaxEjovp7PXRrkKxVYzujbE4PiXa9ed"
                )
              );
            }}
          ></Button>
          <Image
            style={styles.image}
            source={
              image
                ? { uri: image }
                : require("../../images/ImagePlaceholder.jpg")
            }
          />
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
  image: {
    height: 200,
    width: "100%",
    resizeMode: "cover",
  },
});
