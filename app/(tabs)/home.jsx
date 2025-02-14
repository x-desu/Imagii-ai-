import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import Header from "../../components/home/Header";
import Banner from "../../components/home/Banner";
import AiFeaturedList from "../../components/home/AiFeaturedList";
import AiModels from "../../components/home/AiModels";
import { ScrollView } from "react-native";
import { FlatList } from "react-native-web";

const Home = () => {
  return (
    <SafeAreaView>
      <ScrollView className="px-5 ">
        <Header />
        <Banner />
        <AiFeaturedList />
        <AiModels type={"avatar"} />
        <AiModels type={"style"} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
