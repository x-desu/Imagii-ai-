import { View, Text, TextInput } from "react-native";
import React from "react";

const TextInputUpload = ({ userInput }) => {
  return (
    <View>
      <Text className="mt-3">Enter your prompt</Text>
      <TextInput
        placeholder="Enter your prompt here"
        multiline={true}
        numberOfLines={5}
        placeholderTextColor={"#708090"}
        onChangeText={(value) => userInput(value)}
        style={{
          padding: 14,
          minHeight: 180,
          fontSize: 18,
          backgroundColor: "#f0f0f0",
          borderRadius: 14,
          marginTop: 10,
          shadowColor: "#000000",
          shadowRadius: "4",
        }}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="default"
        returnKeyType="send"
        submitBehavior="blurAndSubmit"
      />
    </View>
  );
};

export default TextInputUpload;
