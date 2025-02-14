import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

const Banner = () => {
  return (
    <View className="mt-5 relative">
      <Image
        source={require("../../assets/images/banner.jpg")}
        className="w-full h-64 object-center rounded-2xl object-cover"
      />
      <View className="absolute left-4 top-4">
        <Text className="text-3xl font-bold text-white shadow-black shadow-md">
          Turn Text
        </Text>
        <Text className="text-3xl font-bold text-amber-400 shadow-md">
          Into Ai Art
        </Text>
      </View>
      <TouchableOpacity className="px-4 py-3 rounded-2xl absolute bottom-4 right-4 bg-amber-400/90 shadow-md shadow-black/60">
        <Text className="font-medium text-primary text-xl">Explore</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Banner;
