import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import { MyEvents } from "./screens/myEvents/MyEvents";
import { CreateEvent } from "./screens/createEvent/CreateEvent";

export type RootStackParamList = {
  MyEvents: undefined;
  CreateEvent: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen
          name="MyEvents"
          component={MyEvents}
          initialParams={undefined}
          options={{
            title: "",
            headerLeft: () => {
              return <View></View>;
            },
          }}
        />
        <RootStack.Screen
          name="CreateEvent"
          component={CreateEvent}
          initialParams={undefined}
          options={{
            title: "",
            headerLeft: () => {
              return <View></View>;
            },
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
