import { View, Text } from "react-native";
import React from "react";

import LottieView from "lottie-react-native";
const Coin = ({ width, height }) => {
  return (
    <View>
      <LottieView
        source={{
          uri: "https://lottie.host/a2a712db-ba6f-43d0-9b85-0e3c5711e05a/AJewGtU1cP.lottie",
        }}
        autoPlay
        style={{
          width: width,
          height: height,
        }}
      />
    </View>
  );
};

export default Coin;
