import { useState } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";

interface NumberInputProps {
  title: string;
  suffix?: string;
}

export const NumberInput = (props: NumberInputProps) => {
  const [number, setNumber] = useState("");
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{`${props.title}${
        props.suffix ? ` (${props.suffix})` : ""
      }`}</Text>
      <TextInput
        style={styles.input}
        placeholder={props.title}
        placeholderTextColor="#888"
        onChange={(text) => {
          setNumber(text.nativeEvent.text.replace(/[^0-9.]/g, ""));
        }}
        value={number}
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
