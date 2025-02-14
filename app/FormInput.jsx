import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import TextInputUpload from "../components/forminput/TextInput";
import ImageUpload from "../components/forminput/ImageUpload";
import { Cloudinary } from "@cloudinary/url-gen";
import Toast from "react-native-toast-message";
import {
  AddAiImageRecord,
  AiGenImage,
  UpdateUserCredits,
} from "../services/GlobalApi";
import { useUserSession } from "../context/UserContext";
import { upload } from "cloudinary-react-native";
import Dropdown from "../components/forminput/Dropdown";

const FormInput = () => {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const [aiModel, setAiModel] = useState();
  const [userInput, setUserInput] = useState();
  const [userImage, setUserImage] = useState();
  const [formError, setFormError] = useState("");
  const { userDetails, setUserDetails } = useUserSession();
  const [loading, setLoading] = useState();
  const [selectedValue, setSelectedValue] = useState("");
  useEffect(() => {
    setAiModel(params);
    navigation.setOptions({
      headerShown: true,
      headerTitle: params?.name,
      headerBackTitle: "Back",
    });
  }, []);

  const userInputVal = (value) => {
    setUserInput(value);
    setFormError("");
  };

  const userImageVal = (val) => {
    setUserImage(val);
    setFormError("");
  };

  //image gen text and image to image
  const onGen = async () => {
    if (userDetails?.credits <= 0) {
      Toast.show({
        type: "error",
        text1: "No Credits",
        text2: "This is some something 👋",
        position: "bottom",
      });
      return;
    }
    const data = {
      aiModelName: aiModel?.aiModelName,
      inputPrompt: userInput,
      defaultPrompt: aiModel?.defaultPrompt,
    };

    if (!aiModel?.userImageUpload) {
      TextToImage(data);
    } else {
      ImageToImage();
    }
  };
  console.log(userImage);
  const ImageToImage = async () => {
    setLoading(true);
    const cld = new Cloudinary({
      cloud: {
        cloudName: "ddlbuv5gw",
      },
      url: {
        secure: true,
      },
    });

    const options = {
      upload_preset: "newaisjh",
      unsigned: true,
      tags: ["temporary"],
    };
    let dynamicImageKey = "main_face_image";
    let style = "mode";
    if (
      aiModel?.aiModelName ==
        "fofr/face-to-many:a07f252abbbd832009640b27f063ea52d87d7a23a185ca165bec23b5adc8deaf" ||
      aiModel?.name === "Bg Remover" ||
      aiModel?.name === "Upscale Image"
    ) {
      dynamicImageKey = "image";
      style = "style";
    }
    await upload(cld, {
      file: userImage,
      options: options,
      callback: async (error, response) => {
        const data = {
          aiModelName: aiModel?.aiModelName,
          inputPrompt: userInput,
          defaultPrompt: aiModel?.defaultPrompt,
          [dynamicImageKey]: response?.url,
          [style]: selectedValue,
        };
        if (aiModel?.name == "Upscale Image") {
          data.face_enhance = selectedValue ? true : false;
        }

        try {
          const res = await AiGenImage(data);

          router.push({
            pathname: "/viewAiImage",
            params: {
              imageUrl: res.result,
              prompt: aiModel?.name,
            },
          });
          setLoading(false);
        } catch (error) {
          if (error.response) {
            console.error("Axios Error:", error.response.data);
            setFormError(
              error.response.data?.error ||
                "An error occurred. Please try again."
            );
          } else if (error.request) {
            console.error("No response received:", error.request);
            setFormError(
              "No response from server. Please check your connection."
            );
          } else {
            console.error("Error:", error.message);
            setFormError(
              error.message || "Some error occurred. Please try again."
            );
          }
          setLoading(false);
        }
      },
    });
  };

  const TextToImage = async (data) => {
    setLoading(true);
    try {
      const res = await AiGenImage(data);
      // console.log(res.result);
      router.push({
        pathname: "/viewAiImage",
        params: {
          imageUrl: res?.result,
          prompt: userInput,
        },
      });
      setLoading(false);
      const updatedResult = await UpdateUserCredits(userDetails?.documentId, {
        credits: Number(userDetails?.credits) - 1,
      });
      // console.log("📢 UpdateUserCredits Response:" + updatedResult.data.data);

      setUserDetails(updatedResult.data);
      UploadImageAndSave(res?.result);
    } catch (error) {
      if (error.response) {
        console.error("Axios Error:", error.response.data);
        setFormError(
          error.response.data?.error || "An error occurred. Please try again."
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        setFormError("No response from server. Please check your connection.");
      } else {
        console.error("Error:", error.message);
        setFormError(error.message || "Some error occurred. Please try again.");
      }
      setLoading(false);
    }
  };

  const UploadImageAndSave = async (AiImage) => {
    if (!AiImage) {
      console.error("No AI-generated image provided.");
      return;
    }

    const cld = new Cloudinary({
      cloud: {
        cloudName: "ddlbuv5gw",
      },
      url: {
        secure: true,
      },
    });
    const options = {
      upload_preset: "newaisjh",
      unsigned: true,
    };

    try {
      await upload(cld, {
        file: AiImage,
        options: options,
        callback: async (error, result) => {
          const imgData = {
            imageUrl: result?.url,
            userEmail: userDetails?.userEmail,
            prompt: userInput,
          };

          const SaveImageResult = await AddAiImageRecord(imgData);
        },
      });
    } catch (error) {
      console.error("Upload Failed:", err);
      Toast.show({
        type: "error",
        text1: "Error uploading image",
      });
    }
  };

  return (
    <View className="p-5 bg-white h-full">
      <Toast />
      <Text className="text-xl font-bold">{aiModel?.name}</Text>
      <View>
        {!aiModel?.userImageUpload ? (
          <TextInputUpload userInput={userInputVal} />
        ) : (
          <ImageUpload setImage={userImageVal} userImage={userImage} />
        )}
      </View>
      {aiModel?.name == "Custom" && (
        <View>
          <TextInputUpload userInput={userInputVal} />
        </View>
      )}
      <Text className="w-full text-center mt-2 text-warmGray-400">
        Note: 1 credit per Ai generate
      </Text>
      <View className="mt-4 absolute right-4">
        <Dropdown
          aiModel={aiModel}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
        />
      </View>
      <TouchableOpacity
        onPress={onGen}
        disabled={loading}
        className="p-4 bg-primary rounded-2xl mt-4 "
      >
        {loading ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <Text className="text-xl font-semibold text-white text-center">
            Generate
          </Text>
        )}
      </TouchableOpacity>
      {formError && (
        <Text className="text-sm text-red-500 font-medium">{formError}</Text>
      )}
    </View>
  );
};

export default FormInput;
