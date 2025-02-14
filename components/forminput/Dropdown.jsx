import React, { useMemo, useState } from "react";
import { View, Text } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const Dropdown = ({ aiModel, selectedValue, setSelectedValue }) => {
  const [open, setOpen] = useState(false);

  const options = useMemo(() => {
    if (
      aiModel?.aiModelName ===
      "fofr/face-to-many:a07f252abbbd832009640b27f063ea52d87d7a23a185ca165bec23b5adc8deaf"
    ) {
      return ["3D", "Clay", "Emoji", "Video game", "Pixels", "Toy"];
    } else if (
      aiModel?.aiModelName ===
      "bytedance/pulid:43d309c37ab4e62361e5e29b8e9e867fb2dcbcec77ae91206a8d95ac5dd451a0"
    ) {
      return ["fidelity", "extremely style"];
    } else if (aiModel?.name === "Upscale Image") {
      return ["face_enhance"];
    }
    return [];
  }, [aiModel]);
  const invalidModels = [
    "fofr/face-to-many:a07f252abbbd832009640b27f063ea52d87d7a23a185ca165bec23b5adc8deaf",
    "bytedance/pulid:43d309c37ab4e62361e5e29b8e9e867fb2dcbcec77ae91206a8d95ac5dd451a0",
    "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
  ];

  if (!invalidModels.includes(aiModel?.aiModelName)) {
    return <></>;
  }
  return (
    <View style={{ width: 150 }}>
      <DropDownPicker
        open={open}
        setOpen={setOpen}
        items={options.map((item) => ({ label: item, value: item }))}
        value={selectedValue}
        setValue={setSelectedValue}
        placeholder="Select style"
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#ccc",
        }}
        dropDownContainerStyle={{
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#ccc",
        }}
      />
    </View>
  );
};

export default Dropdown;
