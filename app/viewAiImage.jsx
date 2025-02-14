import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { createAssetAsync, usePermissions } from "expo-media-library";
import * as FileSystem from "expo-file-system";
import Toast from "react-native-toast-message";
import * as Sharing from "expo-sharing";

const ViewAiImage = () => {
  const { imageUrl, prompt } = useLocalSearchParams();
  const navigation = useNavigation();
  const [permissionResponse, requestPermission] = usePermissions();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Ai Image",
      headerBackTitle: "Back",
    });
  }, []);

  useEffect(() => {
    if (permissionResponse?.status === "denied") {
      Alert.alert("Permission Denied", "This app needs access to save Image.");
    }
  }, [permissionResponse]);

  const downloadImage = async () => {
    try {
      if (permissionResponse.status !== "granted") {
        await requestPermission();
      }

      const fileuri = FileSystem.cacheDirectory + Date.now() + "_imagiiAi.png";
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileuri);
      const asset = await createAssetAsync(uri);

      if (asset) {
        // Force refresh
        Alert.alert("Saved", "Image has been saved to your gallery");
      } else {
        Toast.show({
          type: "error",
          text1: "Error saving Image",
          position: "bottom",
        });
      }
    } catch (error) {}
  };

  const handleShare = async () => {
    const fileUri = FileSystem.cacheDirectory + Date.now() + "_imagiiAi.png";
    try {
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
      Sharing.shareAsync(uri, {
        dialogTitle: "Share your Ai Image",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <SafeAreaView>
      <Toast />
      <View className="px-5">
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: "100%",
            height: 400,
            resizeMode: "contain",
            borderRadius: 15,
            shadowColor: "#000000",
            shadowRadius: 2,
            shadowOffset: 1,
          }}
        />
        <Text className="text-gray mt-1 text-xl tracking-wide leading-relaxed">
          <Text className="text-black font-medium line-clamp-6">Prompt : </Text>
          {prompt}
        </Text>

        <View className="mt-12 flex flex-row gap-8 items-center justify-center">
          <TouchableOpacity
            onPress={downloadImage}
            className="py-4 px-8 bg-primary rounded-2xl flex-1
            "
          >
            <Text className="text-white text-center font-semibold  text-xl">
              Download
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleShare}
            className="py-4 px-10 bg-amber-400 rounded-2xl flex-1
            "
          >
            <Text className="text-white text-center font-semibold text-xl">
              Share
            </Text>
          </TouchableOpacity>
        </View>
        <Text className="mt-4 text-red-400/80 text-sm">
          NOTE : Images are deleted after 30 mins
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ViewAiImage;
