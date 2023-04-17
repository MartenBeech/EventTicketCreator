import { StyleSheet, TextInput, View, Text, Pressable } from "react-native";

export const ImageUploader = () => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button}>
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
