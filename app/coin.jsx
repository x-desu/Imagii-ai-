import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useStripe } from "@stripe/stripe-react-native";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { StripeProvider } from "@stripe/stripe-react-native";

const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUB_KEY;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

async function fetchPaymentSheet(value) {
  try {
    const response = await axios.post(
      "https://stripe-1-48y1.onrender.com/payment-sheet",
      {
        value: parseInt(value),
      }
    );

    return response.data; // ✅ Axios automatically parses JSON
  } catch (error) {
    console.error(
      "Error fetching payment sheet:",
      error.response?.data || error.message
    );
    return null;
  }
}

const Coin = () => {
  const [value, setValue] = useState(0);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const initializePaymentSheet = async () => {
    try {
      setLoading(true);
      const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheet(
        value
      );

      if (!paymentIntent || !ephemeralKey || !customer) {
        throw new Error("Missing required payment information");
      }

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Imagii",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        style: "automatic",
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    await initializePaymentSheet();
    const { error, paymentIntent } = await presentPaymentSheet();

    if (error) {
      console.error("Payment sheet error:", error);
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      console.log("PaymentIntent status:", paymentIntent?.status);
      if (paymentIntent?.status === "succeeded") {
        Alert.alert("Success", "Your order is confirmed!");
      } else {
        Alert.alert("Error", "Payment failed or requires additional action.");
      }
    }
  };

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.Imagii.com"
      urlScheme="myapp"
    >
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View className="p-4 flex flex-col gap-8 justify-center h-full">
              <TextInput
                placeholder="Enter coins"
                inputMode="numeric"
                onChangeText={(text) => setValue(text)}
                value={value}
                className="border border-black p-4 rounded-2xl font-bold text-2xl"
                placeholderTextColor={"#000000"}
                keyboardType="default"
                returnKeyType="send"
                submitBehavior="blurAndSubmit"
              />
              <View className="flex flex-row gap-8 justify-center">
                <TouchableOpacity
                  onPress={() => setValue("10")}
                  className="px-8 bg-red-500 py-4 border border-black rounded-2xl"
                >
                  <Text className="text-2xl font-semibold text-amber-100">
                    10
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setValue("100")}
                  className="px-8 bg-red-500 py-4 border border-black rounded-2xl"
                >
                  <Text className="text-2xl font-semibold text-amber-100">
                    100
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setValue("1000")}
                  className="px-8 bg-red-500 py-4 border border-black rounded-2xl"
                >
                  <Text className="text-2xl font-semibold text-amber-100">
                    1000
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={openPaymentSheet}
                className="px-8 bg-amber-400 border border-black py-4  rounded-2xl mx-auto w-1/2"
              >
                <Text className="text-center font-bold text-2xl text-red-500">
                  Buy
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </StripeProvider>
  );
};

export default Coin;
