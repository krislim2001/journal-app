import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  mode: string;
};

export default function BottomNav({ mode }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Mode: {mode}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#222",
    alignItems: "center",
  },
  label: {
    color: "white",
    fontSize: 16,
  },
});
