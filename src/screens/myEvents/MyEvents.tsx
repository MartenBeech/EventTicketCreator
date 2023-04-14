import { StyleSheet, View, Text, ScrollView } from "react-native";
import { NavigationBar } from "../../NavigationBar";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Navigation";

type NavigationRoute = NativeStackScreenProps<RootStackParamList, "MyEvents">;

interface Props {
  navigation: NavigationRoute["navigation"];
  route: NavigationRoute["route"];
}

export const MyEvents = (props: Props) => {
  return (
    <View style={styles.screen}>
      <ScrollView>
        <View style={styles.container}>
          <Text>My Events</Text>
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
});
