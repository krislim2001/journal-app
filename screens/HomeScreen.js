import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import AudioJournal from "../app/JournalComponents/AudioJournal";
import BottomNav from "../app/JournalComponents/BottomNav";
import CameraJournal from "../app/JournalComponents/CameraJournal";
import TextJournal from "../app/JournalComponents/TextJournal";

const SCREEN_WIDTH = Dimensions.get("window").width;

const modes = ["video", "text", "audio"];

export default function HomeScreen() {
  const [modeIndex, setModeIndex] = useState(0);

  const handleSwipe = ({ nativeEvent }) => {
    const velocity = nativeEvent.velocityX;
    if (velocity > 500 && modeIndex > 0) setModeIndex(modeIndex - 1);
    else if (velocity < -500 && modeIndex < modes.length - 1)
      setModeIndex(modeIndex + 1);
  };

  const renderMode = () => {
    const mode = modes[modeIndex];
    if (mode === "video") return <CameraJournal />;
    if (mode === "text") return <TextJournal />;
    if (mode === "audio") return <AudioJournal />;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler onGestureEvent={handleSwipe}>
        <View style={styles.fullScreen}>{renderMode()}</View>
      </PanGestureHandler>
      <BottomNav mode={modes[modeIndex]} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fullScreen: { flex: 1 },
});
