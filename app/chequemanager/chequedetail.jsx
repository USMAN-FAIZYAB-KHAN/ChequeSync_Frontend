import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Button,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const memberLogo = require("../../assets/member-logo.png");

const MessageList = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);

  // Simulate fetching data from an API or local JSON
  useEffect(() => {
    const dummyData = {
      cheques: [
        {
          _id: "60c72b2f9e1d3d001c8b4fa7",
          memberId: "60c72b2f9e1d3d001c8b4fa5",
          amount: 5000,
          image: "https://via.placeholder.com/150",
          processedOn: "2023-05-01T00:00:00.000Z",
          deliveryDate: "2023-05-10T00:00:00.000Z",
          status: "approved",
          month: 3,
          sender: "John Doe",
          message: "John’s cheque image for March.",
          time: "20:02",
        },
        {
          _id: "60c72b2f9e1d3d001c8b4fa8",
          memberId: "60c72b2f9e1d3d001c8b4fa5",
          amount: 3000,
          image: "https://via.placeholder.com/150",
          processedOn: "2023-06-01T00:00:00.000Z",
          deliveryDate: "2023-06-10T00:00:00.000Z",
          status: "rejected",
          month: 4,
          sender: "Jane Doe",
          message: "Jane’s cheque image for April.",
          time: "21:15",
        },
      ],
    };

    setMessages(dummyData.cheques);
  }, []);

  const handleAccept = (messageId) => {
    setMessages(messages.filter((message) => message._id !== messageId));
    setSelectedMessage(null);
  };

  const handleReject = (messageId) => {
    setMessages(messages.filter((message) => message._id !== messageId));
    setSelectedMessage(null);
  };

  return (
    <View style={styles.container}>
      {messages.map((msg) => (
        <TouchableOpacity
          key={msg._id}
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
      ))}

      {/* Modal for message details */}
      {selectedMessage && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={!!selectedMessage}
          onRequestClose={() => setSelectedMessage(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Close Icon */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedMessage(null)}
              >
                <MaterialIcons name="close" size={24} color="#555" />
              </TouchableOpacity>

              <Image
                source={{ uri: selectedMessage.image }}
                style={styles.chequeImage}
              />
              <Text style={styles.modalMessage}>{selectedMessage.message}</Text>
              <View style={styles.modalButtons}>
                <Button
                  title="Accept"
                  onPress={() => handleAccept(selectedMessage._id)}
                  color="#4CAF50"
                />
                <Button
                  title="Reject"
                  onPress={() => handleReject(selectedMessage._id)}
                  color="#F44336"
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#CBCFD2",
    borderRadius: 8,
    marginBottom: 10,
  },
  avatarContainer: {
    backgroundColor: "#F2F2F2",
    padding: 7,
    borderRadius: 25,
    marginRight: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  messageContent: {
    flex: 1,
  },
  senderName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  messageText: {
    color: "#fff",
    fontSize: 13,
  },
  messageTime: {
    color: "#fff",
    fontSize: 12,
  },
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
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  chequeImage: {
    width: 200,
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 15,
  },
});

export default MessageList;
