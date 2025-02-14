import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { Redirect, router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Coin from "../../components/home/Coin";
const Profile = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  if (!user) {
    return <Redirect href="/login" />;
  }

  const handleLogout = async () => {
    try {
      await signOut();
      <Redirect href="/login" />;
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleBuy = () => {
    router.push("/coin");
  };
  return (
    <SafeAreaView>
      <View
        style={{
          marginTop: 36,
        }}
        className="px-4 flex flex-col justify-center items-center"
      >
        <View className="flex flex-col items-center gap-4">
          <Image
            source={{ uri: user?.imageUrl }}
            style={{
              width: 140,
              height: 140,
              borderRadius: "100%",
            }}
          />
          <Text className="text-primary font-bold text-2xl">
            {user?.fullName}
          </Text>
        </View>
        <View className="mt-12 flex flex-col gap-8">
          <TouchableOpacity
            style={{
              height: 80,
              width: "100%",
              paddingHorizontal: 44,

              borderWidth: 2,
              borderRadius: 16,
            }}
            className=" flex   flex-row w-full justify-between
          gap-4 
          items-center "
            onPress={() => router.push("/home")}
          >
            <AntDesign name="pluscircleo" size={32} color="black" />
            <Text className="text-2xl  font-medium">Create</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleBuy}
            style={{
              height: 80,
              width: "100%",
              paddingHorizontal: 44,

              borderWidth: 2,
              borderRadius: 16,
            }}
            className=" flex  flex-row w-full justify-between
          gap-4 
          items-center "
          >
            <Coin width={50} height={50} />
            <Text className="text-2xl  font-medium">Buy more coins</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 80,
              width: "100%",
              paddingHorizontal: 44,

              borderWidth: 2,
              borderRadius: 16,
            }}
            className=" flex  flex-row w-full justify-between
          gap-4 
          items-center "
            onPress={handleLogout}
          >
            <AntDesign name="logout" size={24} color="red" />
            <Text className="text-2xl text-red-500  font-medium">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
