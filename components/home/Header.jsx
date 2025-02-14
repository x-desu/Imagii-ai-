import { View, Text, Image } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import Coin from "./Coin";
import { useUserSession } from "../../context/UserContext";
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
const Header = () => {
  const { user } = useUser();
  const { userDetails, setUserDetails } = useUserSession();

  return (
    <View className="flex flex-row justify-between items-center">
      <Text className="text-3xl font-bold text-primary">Imagii Ai</Text>
      <View className="flex flex-row gap-5 ">
        <View className="flex flex-row items-center justify-center px-1.5 py-0.5 gap-1 rounded-full border-[0.5px] border-black/75">
          <Coin width={40} height={40} />
          <Text className="font-semibold text-2xl tracking-wider">
            {userDetails?.credits}
          </Text>
        </View>
        <View>
          <Image
            source={{ uri: user?.imageUrl }}
            contentFit="cover"
            blurRadius={0.4}
            alt={user?.fullName}
            placeholder={{ blurhash }}
            className="size-16 rounded-full"
            tintColor={"#c74040"}
          />
        </View>
      </View>
    </View>
  );
};

export default Header;
