import { StyleSheet, TextInput as Input, View, Text } from "react-native";

interface TextInputProps {
  title: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

export const TextInput = (props: TextInputProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.title}</Text>
      <Input
        style={styles.input}
        placeholder={props.title}
        placeholderTextColor="#888"
        onChange={(text) => {
          props.setState(text.nativeEvent.text);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "40%", marginHorizontal: "5%", marginVertical: 10 },
  text: {
    fontSize: 10,
  },
  input: {
    padding: 4,
    borderWidth: 1,
    borderRadius: 5,
  },
});
