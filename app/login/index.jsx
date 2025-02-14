import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import { useSSO } from "@clerk/clerk-expo";
import { useCallback, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
const LoginScreen = () => {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();

  const onPressGoogle = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });

      if (createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace("/home");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  const onPressApple = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_apple",
      });

      if (createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace("/home");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <View className="h-full">
      <Image
        source={{
          uri: "https://res.cloudinary.com/ddlbuv5gw/video/upload/ac_none,q_auto:best/v1739455388/Gen-3_Alpha_Turbo_1552600416_animate_this_image_-_Cropped_-_magicstudi_M_5_2_hdjnws.gif",
        }}
        className="w-full h-[600px]"
      />
      <View className="flex flex-1 flex-col gap-3 items-center justify-center px-7 py-8 rounded-t-3xl -mt-8 relative">
        <LinearGradient
          colors={[
            "#ffffff",
            "#f0f0f0",
            "#d9d9d9",
            "#bfbfbf",
            "#a6a6a6",
            "#8c8c8c",
            "#737373",
            "#595959",
            "#404040",
            "#262626",
            "#0d0d0d",
            "#000000",
          ]}
          start={{ x: 0.3, y: 0.3 }}
          end={{ x: 0.3, y: 0.95 }}
          style={styles.gradient}
        />
        <Text className="font-bold text-primary text-4xl">
          Welcome to Imgii-Ai
        </Text>
        <Text className="text-base text-gray font-medium">
          Create Ai Art in Just a Click!
        </Text>
        <View className=" mt-6">
          <Text className="text-primary text-2xl font-extrabold">
            Login With
          </Text>
        </View>
        <View className="flex flex-row items-center gap-8  justify-center">
          <TouchableOpacity
            className="rounded-full p-4 bg-primary"
            onPress={onPressGoogle}
          >
            <Ionicons name="logo-google" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-full p-4 bg-primary"
            onPress={onPressApple}
          >
            <Ionicons name="logo-apple" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-gray">
          By Continuing you agree to our terms and conditions
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});

export default LoginScreen;

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();
