import React, { useState } from "react";
import { View, Text, Pressable, Modal, Image, StyleSheet } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
// Function to get border and text color based on status
const getStatusStyles = (status) => {
  switch (status) {
    case "posted":
      return { borderColor: "border-yellow-400", textColor: "text-yellow-500" };
    case "approved":
      return { borderColor: "border-green-500", textColor: "text-green-600" };
    case "received":
      return { borderColor: "border-orange-500", textColor: "text-orange-600" };
    case "rejected":
      return { borderColor: "border-red-500", textColor: "text-red-600" };
    default:
      return { borderColor: "border-gray-300", textColor: "text-gray-500" };
  }
};

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

const ChequeCard = ({ id, month, date, status, image }) => {
  const { borderColor, textColor } = getStatusStyles(status);
  const router = useRouter();
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
    console.log("updated image.........",result)
    if (!result.canceled) {
      router.push({
        pathname: "/member/upload",
        params: {
          uri: result.assets[0].uri,
          base64: result.assets[0].base64,
          month: months[month - 1],
        },
      });
    }
  };

  console.log("memberimage-----------------------", image);

  // State for modal visibility
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View
      className={`relative p-4 rounded-lg  border-2 ${borderColor} mb-4 bg-white`}
    >
      {/* Action Icons (Top Right) */}
      <View className="absolute top-3 right-3 flex flex-row gap-4">
        {/* View Icon */}
        <Pressable onPress={() => setModalVisible(true)}>
          <FontAwesome name="eye" size={20} color="#2563eb" />
        </Pressable>

        {/* Edit Icon (Visible only if status is Pending) */}
        {status === "posted" && (
          <Pressable onPress={() => takePhoto()}>
            <MaterialIcons name="edit" size={20} color="#f59e0b" />
          </Pressable>
        )}
      </View>

      {/* Content */}
      <View className="flex flex-row justify-between mt-6">
        {/* Date */}
        <View className="mb-3">
          <Text className="font-medium text-gray-500">Date</Text>
          <Text className="font-bold text-gray-900">{date}</Text>
        </View>

        {/* Month */}
        <View className="mb-3">
          <Text className="font-medium text-gray-500">Month</Text>
          <Text className="font-bold text-gray-900">{months[month - 1]}</Text>
        </View>

        {/* Status */}
        <View>
          <Text className="text-sm font-medium text-gray-500">Status</Text>
          <Text className={`font-bold capitalize ${textColor} `}>{status}</Text>
        </View>
      </View>

      {/* Modal for displaying cheque image */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <MaterialIcons name="close" size={24} color="white" />
            </Pressable>
            <Image
              source={{
                uri: image,
              }}
              style={styles.chequeImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
    margin: 10,
    padding: 5,
    backgroundColor: "red",
    borderRadius: 20,
  },
  chequeImage: {
    width: "100%",
    height: 300,
  },
});

export default ChequeCard;
