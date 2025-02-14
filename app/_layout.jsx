import { Stack } from "expo-router";
import "../global.css";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { tokenCache } from "../cache";
import UserProvider from "../context/UserContext";
import { StripeProvider } from "@stripe/stripe-react-native";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <UserProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen
              name="login/index"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </UserProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
