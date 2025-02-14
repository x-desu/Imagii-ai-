import { View, Text, Image, TouchableOpacity } from "react-native";

import React, { useEffect, useState } from "react";
import { GetAiModels } from "../../services/GlobalApi";
import { FlatList } from "react-native";
import { router } from "expo-router";

const AiModels = ({ type }) => {
  const [aiModelList, setAiModelList] = useState();
  const getAiModels = async () => {
    const res = await GetAiModels(type);

    setAiModelList(res?.data?.data);
  };

  useEffect(() => {
    getAiModels();
  }, []);

  const onClickModel = (item) => {
    router.push({
      pathname: "FormInput",
      params: item,
    });
  };

  return (
    <View className="mt-5">
      <Text className="text-xl font-bold text-primary">
        {type?.toUpperCase()}
      </Text>
      <FlatList
        data={aiModelList}
        horizontal={true}
        nestedScrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              marginRight: 14,
              marginBottom: 10,
            }}
            className="relative"
            onPress={() => onClickModel(item)}
          >
            <Image
              source={{ uri: item?.banner?.url }}
              className="w-36 h-44 rounded-3xl"
              style={{
                width: 140,
                height: 180,
                borderRadius: 15,
              }}
            />
            <Text
              style={{
                bottom: 10,
                textAlign: "center",
                width: "100%",
              }}
              className="absolute font-medium text-white shadow-md shadow-black"
            >
              {item?.name}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default AiModels;
