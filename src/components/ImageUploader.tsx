import { StyleSheet, View, Text, Pressable } from "react-native";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { useState } from "react";
import { uploadFileToPinata } from "../rest/ipfs";

export const ImageUploader = () => {
  const [image, setImage] = useState<any>();

  const selectImage = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
    });
    if (result && result.assets) {
      const asset = result.assets[0];
      uploadFileToPinata(asset);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={async () => {
          selectImage();
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
