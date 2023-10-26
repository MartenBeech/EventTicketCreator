import React from "react";
import { View, Modal, StyleSheet } from "react-native";

interface Props {
  isVisible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode; // Add this line for children prop
}

export const BaseModal = (props: Props) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.isVisible}
      onRequestClose={props.onRequestClose}
    >
      <View style={styles.modalContent}>{props.children}</View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
});
