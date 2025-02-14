import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";
import GetUserInfo, { CreateUser } from "../../services/GlobalApi";
import { useUser } from "@clerk/clerk-expo";
import { useUserSession } from "../../context/UserContext";

const TabLayout = () => {
  const { user } = useUser();
  const { userDetails, setUserDetails } = useUserSession();

  useEffect(() => {
    if (user) {
      verifyUser();
    }
  }, [user]);

  const verifyUser = async () => {
    try {
      const result = await GetUserInfo(user?.primaryEmailAddress?.emailAddress);

      if (result.data.data.length !== 0) {
        setUserDetails(result?.data?.data[0]);

        return;
      }

      const data = {
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName,
      };

      const res = await CreateUser(data);
      setUserDetails(res?.data?.data[0]);
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0c5a7e",
        tabBarBackground: () => (
          <View style={{ flex: 1 }}>
            <BlurView intensity={50} tint="light" style={{ flex: 1 }} />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "home-variant" : "home-variant-outline"}
              size={24}
              color={color}
            />
          ),
        }}
        name="home"
      />
      <Tabs.Screen
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "folder" : "folder-outline"}
              size={24}
              color={color}
            />
          ),
        }}
        name="collection"
      />
      <Tabs.Screen
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account" : "account-outline"}
              size={24}
              color={color}
            />
          ),
        }}
        name="profile"
      />
    </Tabs>
  );
};

export default TabLayout;
