import { Ionicons } from "@expo/vector-icons";
import { Camera, CameraView } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CameraJournal() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<"front" | "back">("back");
  const [flash, setFlash] = useState<"off" | "on" | "auto">("off");
  const [torchEnabled, setTorchEnabled] = useState(false);
  const cameraRef = useRef<any>(null);

  // Request Camera Permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Toggle between front and back
  const toggleCameraType = () => {
    setCameraType((prev) => (prev === "back" ? "front" : "back"));
  };

  // Toggle flash mode between "off", "on", "auto"
  const toggleFlash = () => {
    setFlash((prev) =>
      prev === "off" ? "on" : prev === "on" ? "auto" : "off"
    );
  };

  // Toggle flashlight (torch)
  const toggleTorch = () => {
    setTorchEnabled((prev) => !prev);
  };

  // Take a photo using the camera
  const takePhoto = async () => {
    if (cameraRef.current && "takePictureAsync" in cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log("Photo URI:", photo.uri);
        // You can navigate with the photo or save it here
      } catch (err) {
        console.error("Failed to take photo:", err);
      }
    } else {
      console.warn("Camera ref is not available or does not support capture.");
    }
  };

  // Handle permission states
  if (hasPermission === null) return <View />;
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        flash={flash}
        enableTorch={torchEnabled}
      >
        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity onPress={toggleFlash} style={styles.controlButton}>
            <Ionicons
              name={
                flash === "off"
                  ? "flash-off"
                  : flash === "on"
                  ? "flash"
                  : "flash-outline" // use as proxy for "auto"
              }
              size={30}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTorch} style={styles.controlButton}>
            <Ionicons
              name={torchEnabled ? "flashlight" : "flashlight-outline"}
              size={30}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity onPress={toggleCameraType}>
            <Ionicons name="camera-reverse" size={36} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={takePhoto} style={styles.captureButton} />

          <View style={{ width: 36 }} />
        </View>
      </CameraView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  topControls: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomControls: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  controlButton: {
    marginHorizontal: 10,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    borderWidth: 4,
    borderColor: "gray",
  },
});
