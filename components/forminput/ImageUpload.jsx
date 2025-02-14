import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
const ImageUpload = ({ setImage, userImage }) => {
  const requestPermissions = async () => {
    const { status: galleryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (galleryStatus !== "granted" || cameraStatus !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to camera & photos."
      );
      return false;
    }
    return true;
  };
  const resetImage = () => {
    setImage(null);
  };
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };
  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View>
      <Text className="py-1">Upload your image</Text>
      {!userImage && (
        <View
          style={{
            backgroundColor: "#f0f0f0",
            padding: 14,
            height: 240,
            borderRadius: 14,
            marginTop: 10,
            shadowColor: "#000000",
            shadowRadius: "4",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            className="w-1/2 border-r-[1px] border-black h-full flex items-center justify-center"
            onPress={takePhoto}
          >
            <Image
              source={require("../../assets/images/upload.png")}
              style={{ width: 96, height: 96 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={pickImage}
            className="w-1/2 h-full flex items-center justify-center"
          >
            <Image
              source={require("../../assets/images/photos.png")}
              style={{ width: 58, height: 58 }}
            />
          </TouchableOpacity>
        </View>
      )}

      {userImage && (
        <View>
          <Image
            source={
              userImage
                ? { uri: userImage }
                : require("../../assets/images/upload.png")
            }
            style={
              userImage
                ? {
                    width: "100%",
                    height: 300,
                    resizeMode: "cover",
                    borderRadius: 15,
                    shadowColor: "#000000",
                    shadowRadius: 2,
                    shadowOffset: 1,
                  }
                : { width: 96, height: 96 }
            }
          />
          <TouchableOpacity
            style={{
              backgroundColor: "#000000",
              position: "absolute",
              top: 4,
              right: 4,
              padding: 12,
              marginTop: 10,
              borderRadius: 16,
              alignItems: "center",
            }}
            onPress={resetImage}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              🔄 Change
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ImageUpload;
