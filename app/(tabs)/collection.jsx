import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { GetAllAiImages } from "../../services/GlobalApi";
import { FlatList } from "react-native";
import { ActivityIndicator, Animated } from "react-native";

import { router } from "expo-router";

const Collection = () => {
  const [page, setPage] = useState(8);
  const [loading, setLoading] = useState(false);
  const [aiImages, setAiImages] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  useEffect(() => {
    if (hasMoreData) {
      getAllImages(page);
    }
  }, [page]);
  const columnWidth = Dimensions.get("screen").width * 0.9;

  const getAllImages = async (page) => {
    if (loading || !hasMoreData) return;
    setLoading(true);
    const res = await GetAllAiImages(page);
    if (!res || res.length === 0) {
      setHasMoreData(false); // ✅ Stop pagination when no more data
    } else {
      setAiImages((prev) => {
        const newImages = res.filter(
          (img) => !prev.some((p) => p.id === img.id)
        );
        return [...prev, ...newImages];
      });
    }
  };

  const RenderFooter = () => {
    if (loading) {
      return <ActivityIndicator size={"large"} color="#000000" />;
    } else {
      return null;
    }
  };

  const handlePress = (item) => {
    router.push({
      pathname: "/viewAiImage",
      params: {
        imageUrl: item?.imageUrl,
        prompt: item?.prompt,
      },
    });
  };

  return (
    <SafeAreaView>
      <View className=" px-4 ">
        <Text className="text-xl font-bold ">Users Creation</Text>
        <View
          style={{
            marginVertical: 16,
          }}
        >
          <FlatList
            data={aiImages}
            className="mt-8"
            numColumns={2}
            onEndReached={() => getAllImages(page + 8)}
            ListFooterComponent={() => <RenderFooter />}
            onEndReachedThreshold={0.7}
            columnWrapperStyle={{ gap: 16, borderRadius: 14 }}
            contentContainerClassName="gap-4"
            keyExtractor={(item) => item.imageUrl || Math.random().toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const scaleAnim = new Animated.Value(1);

              const handlePressIn = () => {
                Animated.spring(scaleAnim, {
                  toValue: 1.2,
                  useNativeDriver: true,
                }).start();
              };

              const handlePressOut = () => {
                Animated.spring(scaleAnim, {
                  toValue: 1,
                  useNativeDriver: true,
                }).start();
              };
              return (
                <View>
                  <TouchableOpacity
                    onPress={() => handlePress(item)}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={0.8}
                  >
                    <Animated.View
                      className="flex items-center justify-center "
                      style={{ transform: [{ scale: scaleAnim }] }}
                    >
                      <Image
                        source={{ uri: item?.imageUrl }}
                        style={{
                          width: columnWidth / 2,
                          height: 240,
                          borderRadius: 14,
                          shadowColor: "#000000",
                          shadowOpacity: 0.2,
                          shadowRadius: 1,
                          objectFit: "cover",
                        }}
                      />
                      <Text className="line-clamp-1 text-xs">
                        {item?.prompt}
                      </Text>
                    </Animated.View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Collection;
