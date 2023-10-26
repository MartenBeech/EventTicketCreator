import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import { MyEvents } from "./screens/myEvents/MyEvents";
import { CreateEvent } from "./screens/createEvent/CreateEvent";
import { IdentifierModal } from "./components/modals/IdentifierModal";
import { TicketEventAssetId } from "./entities/ticketEvent";
import { Event } from "./screens/myEvents/Event";

export type RootStackParamList = {
  MyEvents: undefined;
  CreateEvent: undefined;
  Event: { ticketEventAssetId: TicketEventAssetId };
};

const RootStack = createStackNavigator<RootStackParamList>();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <IdentifierModal />
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
        <RootStack.Screen
          name="Event"
          component={Event}
          initialParams={{
            ticketEventAssetId: {
              ticketEvent: {
                creatorName: "",
                description: "",
                endDate: "",
                imageUrl: "",
                location: "",
                price: 0,
                startDate: "",
                title: "",
              },
              assetId: 0,
            },
          }}
          options={{
            title: "",
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
