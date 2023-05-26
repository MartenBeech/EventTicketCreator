import { StyleSheet, View, ScrollView, Pressable, Text } from "react-native";
import { NavigationBar } from "../../NavigationBar";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Navigation";
import { getIPFSEventData } from "../../rest/ipfs";
import { useEffect, useState } from "react";
import { TicketEventAssetId } from "../../entities/ticketEvent";
import {
  getAssetIdsFromAccount,
  getManagerFromAssetId,
  getUrlFromAssetId,
} from "../../rest/algorand";
import { smartContractAccountAddr } from "../../../env";
import { getStoreValue } from "../../store";
import { key_address } from "../../constants";
import { EventBox } from "../../components/EventBox";
import { useIsFocused } from "@react-navigation/native";
import { Spinner } from "../../components/Spinner";

type NavigationRoute = NativeStackScreenProps<RootStackParamList, "MyEvents">;

interface Props {
  navigation: NavigationRoute["navigation"];
  route: NavigationRoute["route"];
}

export const MyEvents = (props: Props) => {
  const [events, setEvents] = useState<TicketEventAssetId[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const getAssetUrlsFromAccount = async () => {
        setIsLoading(true);
        const address = await getStoreValue(key_address);
        const assetIds = await getAssetIdsFromAccount(smartContractAccountAddr);

        const assetIdManagers = await Promise.all(
          assetIds.map(async (assetId) => {
            return {
              manager: await getManagerFromAssetId(assetId),
              id: assetId,
            };
          })
        );
        const filteredAssetIds = assetIdManagers
          .filter((assetIdManager) => address === assetIdManager.manager)
          .map((assetIdManager) => {
            return assetIdManager.id;
          });

        const assets = await Promise.all(
          filteredAssetIds.map(async (assetId) => {
            return { url: await getUrlFromAssetId(assetId), id: assetId };
          })
        );
        const events = await Promise.all(
          assets.map(async (asset) => {
            return {
              ticketEvent: await getIPFSEventData(asset.url),
              assetId: asset.id,
            };
          })
        );
        setEvents(events);
        setIsLoading(false);
      };
      getAssetUrlsFromAccount();
    }
  }, [isFocused]);

  return (
    <View style={styles.screen}>
      {isLoading && <Spinner />}
      {!events.length && !isLoading && (
        <View style={styles.textContainer}>
          <Text style={styles.text}>You have no active events</Text>
        </View>
      )}
      <ScrollView>
        <View style={styles.container}>
          {events.map((event, index) => {
            const ticketEvent = event.ticketEvent;
            return (
              <Pressable
                key={`${ticketEvent.title}-${index}`}
                style={styles.button}
                onPress={() => {
                  props.navigation.navigate("Event", {
                    ticketEventAssetId: { ticketEvent, assetId: event.assetId },
                  });
                }}
              >
                <EventBox
                  imageUrl={ticketEvent.imageUrl}
                  title={ticketEvent.title}
                  date={ticketEvent.startDate}
                  location={ticketEvent.location}
                />
              </Pressable>
            );
          })}
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
  image: {
    height: 200,
    width: "100%",
    resizeMode: "cover",
  },
  textContainer: {
    height: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
  },
});
