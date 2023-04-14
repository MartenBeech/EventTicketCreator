import { useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { RootStackParamList } from "./Navigation";

interface Props {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    keyof RootStackParamList,
    undefined
  >;
}

export const NavigationBar = (props: Props) => {
  const myEvents = "MyEvents";
  const createEvent = "CreateEvent";
  const route = useRoute();
  return (
    <View style={styles.container}>
      <Pressable
        style={{ ...styles.button, ...styles.buttonRightBorder }}
        onPress={() => {
          props.navigation.navigate(myEvents);
        }}
      >
        <Text
          style={route.name === myEvents ? styles.textWhite : styles.textGray}
        >
          My Events
        </Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => {
          props.navigation.navigate("CreateEvent");
        }}
      >
        <Text
          style={
            route.name === createEvent ? styles.textWhite : styles.textGray
          }
        >
          Create Event
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "11%",
    flexDirection: "row",
  },
  button: {
    width: "50%",
    backgroundColor: "#222222",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonRightBorder: {
    borderRightWidth: 1,
    borderRightColor: "#FFFFFF",
  },
  textWhite: {
    color: "#FFFFFF",
  },
  textGray: {
    color: "#888888",
  },
});
