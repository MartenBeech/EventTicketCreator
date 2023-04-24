import { StyleSheet, Pressable, Text, View } from "react-native";

interface Props {
  title: string;
  onPress: () => any;
}

export const Button = (props: Props) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={props.onPress}>
        <Text style={styles.text}>{props.title}</Text>
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
    backgroundColor: "#ddd",
  },
  text: {
    fontSize: 10,
  },
});
