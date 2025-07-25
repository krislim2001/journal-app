import React from "react";
import { StyleSheet, View } from "react-native";
import CameraJournal from "../JournalComponents/CameraJournal";

export default function CameraScreen() {
  return (
    <View style={styles.container}>
      <CameraJournal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
