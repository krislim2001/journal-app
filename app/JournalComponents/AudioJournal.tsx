import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AudioJournal() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🎙️ Audio Mode (To be implemented)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18 },
});
