import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  GestureHandlerRootView,
  HandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
} from "react-native-gesture-handler";
import AudioJournal from "../JournalComponents/AudioJournal";
import BottomNav from "../JournalComponents/BottomNav";
import CameraJournal from "../JournalComponents/CameraJournal";
import TextJournal from "../JournalComponents/TextJournal";

const SCREEN_WIDTH = Dimensions.get("window").width;
const modes = ["video", "text", "audio"];

type SwipeGestureEvent = PanGestureHandlerGestureEvent;

export default function HomeScreen() {
  const [modeIndex, setModeIndex] = useState(0);
  const [lastVelocityX, setLastVelocityX] = useState(0);

  const handleGestureEvent = (event: SwipeGestureEvent) => {
    // Just capture the velocity
    setLastVelocityX(event.nativeEvent.velocityX);
  };

  const handleGestureEnd = (event: HandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.END) {
      const velocity = lastVelocityX;

      if (velocity > 500 && modeIndex > 0) {
        setModeIndex(modeIndex - 1);
      } else if (velocity < -500 && modeIndex < modes.length - 1) {
        setModeIndex(modeIndex + 1);
      }
    }
  };

  const renderMode = () => {
    const mode = modes[modeIndex];
    if (mode === "video") return <CameraJournal />;
    if (mode === "text") return <TextJournal />;
    if (mode === "audio") return <AudioJournal />;
    return null;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleGestureEnd}
      >
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
