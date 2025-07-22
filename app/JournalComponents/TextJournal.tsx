import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

export default function TextJournal() {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Write your thoughts..."
        multiline
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  input: { flex: 1, fontSize: 16 },
});
