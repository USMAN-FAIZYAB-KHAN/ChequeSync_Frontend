import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  Button,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const memberLogo = require("../../assets/member-logo.png");

const MessageList = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [rejectedImages, setRejectedImages] = useState({});


  useEffect(() => {
    const dummyData = {
      cheques: [
        {
          _id: "60c72b2f9e1d3d001c8b4fa1",
          sender: "John Doe",
          amount: 5000,
          image: "https://via.placeholder.com/150",
          message: "John’s cheque image for March.",
          time: "20:02",
        },
        {
          _id: "60c72b2f9e1d3d001c8b4fa2",
          sender: "Jane Doe",
          amount: 3000,
          image: "https://via.placeholder.com/150",
          message: "Jane’s cheque image for April.",
          time: "21:15",
        },
      ],
    };

    setMessages(dummyData.cheques);
    setFilteredMessages(dummyData.cheques);
  }, []);

  const takePhoto = async () => {
    setCapturedImage(null); // Reset the captured image
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access the camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    
    console.log(result.assets[0])
    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
      alert("Photo captured successfully!");
    }

    return result.assets[0]
  };

  const handleReceiveSingle = (messageId) => {
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg._id !== messageId)
    );
    setSelectedMessage(null);
  };


  useEffect(()=>{
    console.log(selectedMessage)
  },[selectedMessage])

  const handleRejectSingle = async (messageId) => {
    let result = await takePhoto(); // Photo capture karna
  
    if (result?.uri) {
      // Store the rejected image for the specific message
      setRejectedImages((prev) => ({
        ...prev,
        [messageId]: result.uri,
      }));
      alert("Image updated for the selected message!");
      setCapturedImage(null);
      // setSelectedMessage(null);
    }
  };

  const closingMsg = async (msgId) => {
    setRejectedImages((prev) => ({
      ...prev,
      [msgId]: null,
    }));
  }

  const handleSubmit = () => {
    alert("Image submitted successfully!");
    setCapturedImage(null);
    setSelectedMessage(null);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item._id}
        renderItem={({ item: msg }) => (
          <TouchableOpacity
            onPress={() => setSelectedMessage(msg)}
            style={styles.messageCard}
          >
            <View style={styles.avatarContainer}>
              <Image style={styles.avatar} source={memberLogo} />
            </View>
            <View style={styles.messageContent}>
              <Text style={styles.senderName}>{msg.sender}</Text>
              <Text style={styles.messageText}>{msg.message}</Text>
            </View>
            <Text style={styles.messageTime}>{msg.time}</Text>
          </TouchableOpacity>
        )}
      />

      {selectedMessage && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={!!selectedMessage}
          onRequestClose={() => setSelectedMessage(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedMessage(null)}
              >
                <MaterialIcons name="close" size={24} color="#555"
                
                  onPress={()=>{
                    closingMsg(selectedMessage._id)
                    setSelectedMessage(null);
                    
                  }}
                />
              </TouchableOpacity>

              <Image
                source={{ uri: rejectedImages[selectedMessage._id] || selectedMessage.image }}
                style={styles.chequeImage}
              />

              <Text style={styles.modalMessage}>{selectedMessage.message}</Text>

              <View style={styles.modalButtons}>
                {capturedImage ? (
                  <Button title="Submit" onPress={handleSubmit} color="#4CAF50" />
                ) : (
                  <>
                    <Button
                      title="Receive"
                      onPress={() => handleReceiveSingle(selectedMessage._id)}
                      color="#4CAF50"
                    />
                    <Button
                      title="Reject"
                      onPress={() => handleRejectSingle(selectedMessage._id)}
                      color="#F44336"
                    />
                  </>
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  messageCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#CBCFD2",
    borderRadius: 8,
    marginBottom: 10,
  },
  avatarContainer: { marginRight: 10 },
  avatar: { width: 30, height: 30, borderRadius: 20 },
  messageContent: { flex: 1 },
  senderName: { fontWeight: "bold" },
  messageText: { color: "#333" },
  messageTime: { color: "#333" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: { position: "absolute", top: 10, right: 10 },
  chequeImage: { width: 200, height: 200, marginBottom: 15, borderRadius: 10 },
  modalMessage: { fontSize: 16, marginBottom: 15 },
  modalButtons: { flexDirection: "row", justifyContent: "space-around", width: "100%" },
});

export default MessageList;
