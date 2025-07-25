import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import {
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
} from "expo-camera";
import React, { useRef, useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CaptureMode = "photo" | "video";

export default function CameraJournal() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [isRecording, setIsRecording] = useState(false);
  const [captureMode, setCaptureMode] = useState<CaptureMode>("video");
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"photo" | "video" | null>(
    null
  );

  const cameraRef = useRef<CameraView | null>(null);

  // Toggle camera (front/back)
  const toggleCameraType = () => {
    setCameraType((prev) => (prev === "back" ? "front" : "back"));
  };

  // Toggle flash mode cycle: off -> on -> auto -> off
  const toggleFlash = () => {
    setFlash((prev) =>
      prev === "off" ? "on" : prev === "on" ? "auto" : "off"
    );
  };

  // Handle mode selection
  const selectMode = (mode: CaptureMode) => {
    setCaptureMode(mode);
    setShowModeDropdown(false);
  };

  // Take a photo
  const takePhoto = async () => {
    if (!cameraRef.current) {
      console.warn("Camera not ready");
      return;
    }
    try {
      const photo = await cameraRef.current.takePictureAsync();
      console.log("Photo URI:", photo.uri);
      setPreviewUri(photo.uri);
      setPreviewType("photo");
    } catch (error) {
      console.error("Photo capture error:", error);
    }
  };

  // Start/stop video recording
  const handleVideoRecording = async () => {
    if (!cameraRef.current) {
      console.warn("Camera not ready");
      return;
    }
    if (isRecording) {
      try {
        await cameraRef.current.stopRecording();
        setIsRecording(false);
      } catch (error) {
        console.error("Stop recording error:", error);
      }
    } else {
      try {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync();
        setIsRecording(false);
        if (video && video.uri) {
          console.log("Video URI:", video.uri);
          setPreviewUri(video.uri);
          setPreviewType("video");
        }
      } catch (error) {
        console.error("Start recording error:", error);
        setIsRecording(false);
      }
    }
  };

  // Handle unified capture button
  const handleCapture = () => {
    if (captureMode === "photo") {
      takePhoto();
    } else {
      handleVideoRecording();
    }
  };

  // Close preview
  const closePreview = () => {
    setPreviewUri(null);
    setPreviewType(null);
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
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
      >
        <View style={styles.topControls}>
          <TouchableOpacity onPress={toggleFlash} style={styles.controlButton}>
            <Ionicons
              name={
                flash === "off"
                  ? "flash-off"
                  : flash === "on"
                  ? "flash"
                  : "flash-outline"
              }
              size={30}
              color="white"
            />
          </TouchableOpacity>

          {/* Mode Toggle */}
          <View style={styles.modeToggleContainer}>
            <TouchableOpacity
              onPress={() => setShowModeDropdown(!showModeDropdown)}
              style={styles.modeToggle}
            >
              <Text style={styles.modeText}>
                {captureMode === "video" ? "VIDEO" : "PHOTO"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="white" />
            </TouchableOpacity>

            {showModeDropdown && (
              <View style={styles.dropdown}>
                <TouchableOpacity
                  onPress={() => selectMode("photo")}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownText}>PHOTO</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => selectMode("video")}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownText}>VIDEO</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={toggleCameraType}
            style={styles.controlButton}
          >
            <Ionicons name="camera-reverse" size={36} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomControls}>
          <TouchableOpacity
            onPress={handleCapture}
            style={[
              styles.captureButton,
              captureMode === "video"
                ? isRecording
                  ? styles.recordingButton
                  : styles.videoButton
                : styles.photoButton,
            ]}
          >
            {captureMode === "video" && (
              <View
                style={[
                  styles.innerButton,
                  isRecording ? styles.recordingInner : styles.videoInner,
                ]}
              />
            )}
          </TouchableOpacity>
        </View>
      </CameraView>

      {/* Preview Modal */}
      <Modal
        visible={previewUri !== null}
        transparent={false}
        animationType="slide"
        onRequestClose={closePreview}
      >
        <View style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <TouchableOpacity onPress={closePreview} style={styles.closeButton}>
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.previewContent}>
            {previewType === "photo" && previewUri && (
              <Image source={{ uri: previewUri }} style={styles.previewImage} />
            )}
            {previewType === "video" && previewUri && (
              <Video
                source={{ uri: previewUri }}
                style={styles.previewVideo}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
    fontSize: 16,
  },
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
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  controlButton: {
    marginHorizontal: 10,
  },
  modeToggleContainer: {
    alignItems: "center",
    position: "relative",
  },
  modeToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  modeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  dropdown: {
    position: "absolute",
    top: 40,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 8,
    minWidth: 80,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  photoButton: {
    backgroundColor: "white",
  },
  videoButton: {
    backgroundColor: "transparent",
  },
  recordingButton: {
    backgroundColor: "transparent",
    borderColor: "red",
  },
  innerButton: {
    borderRadius: 4,
  },
  videoInner: {
    width: 24,
    height: 24,
    backgroundColor: "red",
  },
  recordingInner: {
    width: 20,
    height: 20,
    backgroundColor: "red",
  },
  permissionButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    margin: 20,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  previewHeader: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    zIndex: 1000,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  closeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  previewContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  previewVideo: {
    width: "100%",
    height: "100%",
  },
});
