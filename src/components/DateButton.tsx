import { StyleSheet, View, Text, Pressable } from "react-native";

interface Props {
  title: string;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
}

export const DateButton = (props: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.title}</Text>
      <Pressable
        style={styles.pressable}
        onPress={() => {
          props.setModalVisible(true);
        }}
      >
        {props.value ? (
          <Text>{props.value}</Text>
        ) : (
          <Text style={styles.pressableText}>{props.title}</Text>
        )}
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
  text: {
    fontSize: 10,
  },
  pressable: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 5,
  },
  pressableText: {
    color: "#888",
  },
});
