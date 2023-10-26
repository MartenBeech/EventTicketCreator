import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { BaseModal } from "./BaseModal"; // Import the base modal

interface Props {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const FacebookSelectEventModal = (props: Props) => {
  return (
    <BaseModal isVisible={props.isVisible} onRequestClose={props.onCancel}>
      <Text style={styles.modalText}>Facebook Integration</Text>
      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={props.onCancel} />
        <Button
          title="Confirm"
          onPress={() => {
            props.onConfirm();
            props.onCancel();
          }}
          color="red"
        />
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
