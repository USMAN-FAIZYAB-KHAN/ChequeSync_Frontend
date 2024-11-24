import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { getMembersPostedCheque, updateChequeStatus } from "../../serverRequest.js";
import { useSocket } from "../../context/socket.js"; // Adjust path as necessary
import * as Notifications from "expo-notifications";


const _id = "67350023a70877fe03ff504e"

const memberLogo = require("../../assets/member-logo.png");

const MessageList = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const socket = useSocket();


  useEffect(() => {
    // Request permissions for notifications
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      console.log(status)
      if (status !== "granted") {
        console.log("Notification permissions not granted!");
      } else {
        console.log("Notification permissions granted!");
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Register user when socket connects
    socket.emit("registerUser", { userId: _id });

    // Listener for confirmation
    const handleConfirmation = (message) => {
      console.log("Confirmation received:", message);
    };

    // Listener for notifications
    const handleNotification = async (notification) => {
      let message = notification.message
      try {
        const notificationMessage =
          typeof message === "string" ? JSON.parse(message).message : message.message;
    
        if (!notificationMessage) {
          console.error("Invalid notification payload");
          return;
        }
    
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Cheque Posted",
            body: notificationMessage,
            sound: "default",
          },
          trigger: null,
        });
        console.log("Notification scheduled successfully");
      } catch (error) {
        console.error("Error scheduling notification:", error);
      }
    };
    

    // Listener for errors
    const handleError = (error) => {
      console.error("Socket.IO Error:", error);
    };

    // Attach event listeners
    socket.on("receiveConfirmation", handleConfirmation);
    socket.on("receiveNotification", handleNotification);
    socket.on("error", handleError);


  }, [socket, _id]); // Dependencies: socket and _id
  
  
  const fetchCheques = async () => {
    try {
      const response = await getMembersPostedCheque();
      const cheques = response.data.formattedCheques;
      setMessages(cheques);
      setFilteredMessages(cheques);
    } catch (error) {
      console.error("Error fetching cheques:", error);
    }
  };

  useEffect(() => {
    fetchCheques();
  }, []);

  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(messages.map((msg) => msg._id));
    }
    setIsSelectAll(!isSelectAll);
  };

  const handleSelectMessage = (messageId) => {
    if (isSelectAll) {
      setSelectedMessages((prevSelected) =>
        prevSelected.includes(messageId)
          ? prevSelected.filter((id) => id !== messageId)
          : [...prevSelected, messageId]
      );
    } else {
      const message = messages.find((msg) => msg._id === messageId);
      setSelectedMessage(message);
    }
  };

  const handleChequeStatus = async (messageId, status) => {
    try {
      const response = await updateChequeStatus(messageId, status);
      if (response.statusCode === 200) {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
        );
        setFilteredMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
        );
        setSelectedMessage(null);
      } else {
        console.error("Failed to update cheque status:", response.data);
      }
    } catch (error) {
      console.error("Error updating cheque status:", error);
    }
  };

  const handleRejectSingle = async (messageId) => {
    await handleChequeStatus(messageId, "rejected");
  };

  const handleReceive = async () => {
    try {
      const promises = selectedMessages.map((id) =>
        updateChequeStatus(id, "received")
      );
      await Promise.all(promises);

      setMessages((prevMessages) =>
        prevMessages.filter((msg) => !selectedMessages.includes(msg._id))
      );
      setFilteredMessages((prevMessages) =>
        prevMessages.filter((msg) => !selectedMessages.includes(msg._id))
      );

      setSelectedMessages([]);
      setIsSelectAll(false);
    } catch (error) {
      console.error("Error receiving cheques:", error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = messages.filter((msg) =>
      msg.sender.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMessages(filtered);
  };

  return (
    <View className="flex-1 p-4">
      {/* Search Bar */}
      <View className="flex-row items-center mb-4">
        <MaterialIcons name="search" size={20} color="#9ca3af" className="pr-2" />
        <TextInput
          className="flex-1 h-10 border border-gray-300 rounded-full pl-4 outline-none"
          placeholder="Search by sender name"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Buttons */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity
          onPress={handleSelectAll}
          className={`py-[10px] px-10 rounded-full ${filteredMessages.length === 0 ? 'bg-gray-400' : 'bg-emerald-600'}`}
          disabled={filteredMessages.length === 0}
        >
          <Text className="text-white font-medium">
            {isSelectAll ? "Deselect All" : "Select All"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleReceive}
          className={`py-[10px] px-10 rounded-full ${selectedMessages.length === 0 ? "bg-gray-400" : "bg-emerald-600"}`}
          disabled={selectedMessages.length === 0}
        >
          <Text className="text-white font-medium">Receive</Text>
        </TouchableOpacity>
      </View>

      {/* No messages or search results message */}
      {filteredMessages.length === 0 && (
        <View className="flex-1 justify-center items-center">
          <FontAwesome name="exclamation-circle" size={50} color="#ccc" />
          <Text className="text-gray-500 text-3xl mt-2">No Messages Found</Text>
        </View>
      )}

      {/* List of Messages */}
      {filteredMessages.length > 0 && (
        <FlatList
          data={filteredMessages}
          keyExtractor={(item) => item._id}
          renderItem={({ item: msg }) => (
            <TouchableOpacity
              onPress={() => handleSelectMessage(msg._id)}
              className={`flex-row items-center p-3 rounded-lg mb-3 ${
                selectedMessages.includes(msg._id) ? "border-2 border-green-500" : "bg-gray-200"
              }`}
            >
              {selectedMessages.includes(msg._id) && (
                <MaterialIcons
                  name="check-circle"
                  size={24}
                  color="#26CC00"
                  className="mr-3"
                />
              )}
              <View className="bg-gray-300 w-12 h-12 p-2 rounded-full mr-3"></View>
              <View className="flex-1">
                <Text className="font-bold text-emerald-500 text-base">{msg.sender}</Text>
                <Text className="text-gray-500 font-medium">{msg.message}</Text>
              </View>
              <Text className="text-gray-500 font-medium">{msg.time}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal for Single Message */}
      {selectedMessage && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={!!selectedMessage}
          onRequestClose={() => setSelectedMessage(null)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-70">
            <View className="w-4/5 bg-white p-4 rounded-lg items-center">
              <TouchableOpacity
                className="absolute top-2 right-2"
                onPress={() => setSelectedMessage(null)}
              >
                <MaterialIcons name="close" size={24} color="#555" />
              </TouchableOpacity>
              <Image
                source={{ uri: selectedMessage.image }}
                className="w-64 h-48 mt-4 mb-4 rounded-lg"
              />
              <Text className="text-gray-800 mb-4 text-base font-semibold">
                {selectedMessage.message}
              </Text>
              <View className="w-64 mb-4">
                <TouchableOpacity
                  onPress={() => handleChequeStatus(selectedMessage._id, "received")}
                  style={{
                    backgroundColor: "#4CAF50",
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Receive
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleRejectSingle(selectedMessage._id, "rejected")}
                  style={{
                    backgroundColor: "#F44336",
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRadius: 5,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Reject
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default MessageList;
