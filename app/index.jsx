import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  const { isSignedIn, user } = useUser();
  return (
    <View>
      {isSignedIn ? (
        <Redirect href={"/(tabs)/home"} />
      ) : (
        <Redirect href={"/login"} />
      )}
    </View>
  );
}
