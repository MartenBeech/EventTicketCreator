import { Button, StyleSheet, View } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
  SignedMessage,
  SignedMessageSimplified,
} from "../entities/SignedMessage";
import { verifyMessage } from "../algorand/verifyMessage";
import { getAssetAmountFromAccount } from "../rest/algorand";
import { TicketEventAssetId } from "../entities/ticketEvent";
import { useEffect, useState } from "react";
import { Spinner } from "./Spinner";

interface Props {
  ticketEventAssetId: TicketEventAssetId;
  setIsScannerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const QrScanner = (props: Props) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      setIsLoading(true);
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasCameraPermission(status === "granted");

      if (status != "granted") {
        alert("Camera permission is not granted");
        props.setIsScannerOpen(false);
      }
      setIsLoading(false);
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    try {
      const verifyDataSimplified: SignedMessageSimplified = JSON.parse(data);

      const verifyData: SignedMessage = {
        message: Uint8Array.from(verifyDataSimplified.message),
        publicKey: verifyDataSimplified.publicKey,
        signature: Uint8Array.from(verifyDataSimplified.signature),
      };

      const isMessageValid = verifyMessage(verifyData);

      if (isMessageValid) {
        alert("message is valid!");
        const assetAmount = await getAssetAmountFromAccount(
          verifyData.publicKey,
          props.ticketEventAssetId.assetId
        );
        alert(
          "wallet " + verifyData.publicKey + "has " + assetAmount + "tickets"
        );
      }

      props.setIsScannerOpen(false);
    } catch (error) {
      console.error(error);
      alert(error);
      props.setIsScannerOpen(false);
    }
  };

  return (
    <View style={styles.screen}>
      {isLoading && <Spinner />}
      {hasCameraPermission && (
        <View>
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            style={[styles.cameraContainer]}
          >
            <View style={styles.viewfinderContainer}>
              <View style={styles.row}>
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
              </View>
              <View style={styles.row}>
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />
              </View>
            </View>
          </BarCodeScanner>
          <Button
            title="Close scanner"
            onPress={() => props.setIsScannerOpen(false)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    height: "100%",
  },
  cameraContainer: {
    alignItems: "center",
    height: "85%",
  },
  viewfinderContainer: {
    alignItems: "center",
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
  },
  corner: {
    width: 50,
    height: 50,
    borderWidth: 4,
    borderColor: "white",
  },
  cornerTopLeft: {
    top: -50,
    left: -50,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  cornerTopRight: {
    top: -50,
    right: -50,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  cornerBottomLeft: {
    bottom: -50,
    left: -50,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  cornerBottomRight: {
    bottom: -50,
    right: -50,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
});
