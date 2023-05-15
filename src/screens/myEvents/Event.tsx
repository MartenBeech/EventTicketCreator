import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Navigation";
import { smartContractAccountAddr } from "../../../env";
import {
  getAssetAmountFromAccount,
  getTotalFromAsset,
} from "../../rest/algorand";
import { useEffect, useState } from "react";
import { getFileFromPinata } from "../../rest/ipfs";
import { useIsFocused } from "@react-navigation/native";
type NavigationRoute = NativeStackScreenProps<RootStackParamList, "Event">;

interface Props {
  navigation: NavigationRoute["navigation"];
  route: NavigationRoute["route"];
}

export const Event = (props: Props) => {
  const ticketEventAssetId = props.route.params.ticketEventAssetId;
  const ticketEvent = ticketEventAssetId.ticketEvent;

  const [ticketsLeft, setTicketsLeft] = useState(0);
  const [ticketsSold, setTicketsSold] = useState(0);
  const [image, setImage] = useState("");
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const getTicketAmounts = async () => {
        const totalAmount = await getTotalFromAsset(ticketEventAssetId.assetId);
        const assetAmount = await getAssetAmountFromAccount(
          smartContractAccountAddr,
          ticketEventAssetId.assetId
        );
        const fileImage = await getFileFromPinata(ticketEvent.imageUrl);

        setTicketsLeft(assetAmount);
        setTicketsSold(totalAmount - assetAmount);
        setImage(fileImage);
      };
      getTicketAmounts();
    }
  }, []);

  return (
    <ScrollView>
      <Image
        style={styles.image}
        source={
          image ? { uri: image } : require("../../images/ImagePlaceholder.jpg")
        }
      />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{ticketEvent.title}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.info}>{ticketEvent.startDate}</Text>
          <Text style={styles.info}>{ticketEvent.endDate}</Text>
          <Text style={styles.info}>{ticketEvent.location}</Text>
          <Text style={styles.info}>{ticketEvent.creatorName}</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{ticketEvent.description}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            Price: {ticketEvent.price ? `${ticketEvent.price} kr.` : "Free"}
          </Text>
        </View>
        <Pressable style={styles.buyTicketButton} onPress={async () => {}}>
          <Text style={styles.buyTicketText}>Verify Tickets</Text>
        </Pressable>
        <View style={styles.ticketsCounterContainer}>
          <Text style={styles.ticketsCounter}>{ticketsLeft} tickets left</Text>
          <Text style={styles.ticketsCounter}>{ticketsSold} tickets sold</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  image: {
    height: 200,
    width: "100%",
    resizeMode: "cover",
  },
  titleContainer: {
    marginHorizontal: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  infoContainer: {
    marginBottom: 16,
  },
  info: {
    fontSize: 14,
    fontStyle: "italic",
  },
  descriptionContainer: {
    marginBottom: 32,
  },
  description: {
    fontSize: 12,
  },
  priceContainer: {
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
  },
  buyTicketButton: {
    height: 50,
    width: "100%",
    backgroundColor: "#5955FF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  buyTicketText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  ticketsCounterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  ticketsCounter: {
    fontSize: 12,
    fontStyle: "italic",
  },
});
