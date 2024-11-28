import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome5 } from "@expo/vector-icons";
import { saveChequeRequest } from "../../serverRequest.js"
import { useRouter } from 'expo-router';
import { useEffect } from "react";
import { useLocalSearchParams } from 'expo-router';
import { auth } from "../../global/global.js";




const UploadScreen = () => {
  const accessToken = auth.accessToken;  
  const router = useRouter();
  const { month } = useLocalSearchParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [base64Image, setBase64Image] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(month || "");
  const [isFocused, setIsFocused] = useState(false);
  
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];


  useEffect(() => {
    console.log(selectedMonth);
  }, [selectedMonth]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setBase64Image(result.assets[0].base64);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMonth) {
        alert("Please select a month!");
        return;
    }

    let result = await saveChequeRequest({
        memberId: auth.id,
        month: months.indexOf(selectedMonth) + 1,
        image: base64Image,
        accessToken
    });
    if (result && result.statusCode === 201) {
        setSelectedImage(null);
        setSelectedMonth("");
        setShowFullScreen(false);
        router.push("/member/cheque");
    } else {
        alert(result || "An error occurred while saving the cheque request.");
    }


  };
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access the camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setBase64Image(result.assets[0].base64);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  return (
    <View className="flex-1 items-center p-5 bg-gray-100">
      <View className="flex-row items-center justify-around w-full mb-4">
        <Text className="text-base font-medium ">Select Month</Text>
        <View
          className={`border-2 rounded-lg pl-2  ${
            isFocused ? "border-blue-500" : "border-gray-300"
          } bg-white w-1/2 overflow-hidden`}
        >
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            className="h-12 text-gray-700 "
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <Picker.Item label="Select month" value="" />
            {months.map((month, index) => (
              <Picker.Item key={index} label={month} value={month} />
            ))}
          </Picker>
        </View>
      </View>

      {selectedImage ? (
        <View className="items-center mt-5 w-full">
          {/* Image Display with Touchable */}
          <TouchableOpacity onPress={() => setShowFullScreen(true)}>
            <Image
              source={{ uri: selectedImage }}
              className="w-80 h-48 rounded-md mb-4"
            />
          </TouchableOpacity>

          {/* Buttons in Vertical Layout */}
          <View className="w-full mt-4 items-center ">
            <TouchableOpacity
              onPress={removeImage}
              className="flex-row bg-red-500 p-4 rounded-md items-center justify-center w-80 mb-4"
            >
              <FontAwesome5 name="trash" size={24} color="#fff" />
              <Text className="text-white text-center font-bold ml-4">
                Remove
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-blue-600 p-4 rounded-md items-center justify-center shadow-md w-80"
            >
              <Text className="text-white font-bold">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <TouchableOpacity
            onPress={pickImage}
            className="w-full h-52 border-gray-400 rounded-lg flex items-center justify-center border-dashed border-2"
          >
            <FontAwesome5 name="cloud-upload-alt" size={40} color="#bbb" />
            <Text className="text-gray-500 text-center mb-2 text-base">
              Click to upload or drag and drop
            </Text>
            
            <Text className="text-gray-400 text-sm">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </Text>
          </TouchableOpacity>

          <View className="flex items-center w-full mt-4">
            {/* Show Take Photo Button Only When Image is Not Selected */}
            <TouchableOpacity
              onPress={takePhoto}
              className="bg-blue-600 items-center justify-center w-full rounded-lg h-16 mb-4 shadow-md active:bg-blue-700"
            >
              <View className="flex-row items-center">
                <FontAwesome5 name="camera" size={24} color="#fff" />
                <Text className="text-white text-lg ml-4">Take Photo</Text>
              </View>
            </TouchableOpacity>

            {/* Text for Instructions */}
            <Text className="text-gray-500 text-base text-center">
              Please take a clear horizontal picture of the cheque
            </Text>
          </View>
        </>
      )}

      <Modal
        visible={showFullScreen}
        transparent={true}
        onRequestClose={() => setShowFullScreen(false)}
      >
        <View className="flex-1 items-center justify-center bg-black bg-opacity-80">
          <TouchableOpacity
            className="absolute top-10 right-5 p-2 bg-white rounded-full"
            onPress={() => setShowFullScreen(false)}
          >
            <FontAwesome5 name="times" size={24} color="#000" />
          </TouchableOpacity>
          <Image
            source={{ uri: selectedImage }}
            className="w-full h-4/5 object-contain"
          />
        </View>
      </Modal>
    </View>
  );
};

export default UploadScreen;
