import { StyleSheet, TextInput, View, Text, Pressable } from "react-native";
import {
  ImagePickerResult,
  launchImageLibraryAsync,
  MediaTypeOptions,
  launchCameraAsync,
} from "expo-image-picker";
import { useState } from "react";
import { pinImage, uploadToPinata } from "../rest/ipfs";

export const ImageUploader = () => {
  const [image, setImage] = useState<any>();

  const submitImage = async (result: ImagePickerResult) => {
    if (result && result.assets) {
      const data = result.assets[0];
      if (data.uri) {
        uploadToPinata(
          "https://i.pcmag.com/imagery/articles/00Cx7vFIetxCuKxQeqPf8mi-63..v1666730631.png"
        );
        // pinImage(data.uri);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={async () => {
          const result = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
          });
          submitImage(result);
        }}
      >
        <Text style={styles.text}>Upload Image</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "40%",
    marginHorizontal: "5%",
    marginVertical: 10,
  },
  button: {
    padding: 4,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
  },
  text: {
    fontSize: 10,
  },
});
