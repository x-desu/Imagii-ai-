import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { GetFeaturedCategoryList } from "../../services/GlobalApi";
import { FlatList } from "react-native";
import { useRouter } from "expo-router";
const AiFeaturedList = () => {
  const [aiModels, setAiModels] = useState();
  const router = useRouter();
  useEffect(() => {
    const getAiModels = async () => {
      const res = await GetFeaturedCategoryList();
      setAiModels(res?.data?.data);
    };
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
      <Text className="font-bold text-2xl">Featured</Text>
      <View className="flex flex-row gap-4 items-center">
        <FlatList
          data={aiModels}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="flex flex-col items-center justify-center gap-1">
              <TouchableOpacity
                style={{
                  padding: 2,
                  borderRadius: 12,
                  marginTop: 7,
                  padding: 12,
                  backgroundColor: "#ebb728",
                }}
                onPress={() => onClickModel(item)}
              >
                <Image
                  source={{ uri: item?.icon?.url }}
                  style={{
                    width: 35,
                    height: 35,
                  }}
                />
              </TouchableOpacity>
              <Text
                className="font-medium"
                style={{ fontSize: 12, textAlign: "center" }}
              >
                {item?.name}
              </Text>
            </View>
          )}
          horizontal={true}
          keyExtractor={(item) => item.id}
          contentContainerClassName="flex flex-row gap-8 items-center"
        />
      </View>
    </View>
  );
};

export default AiFeaturedList;
