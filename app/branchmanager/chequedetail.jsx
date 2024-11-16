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

const memberLogo = require("../../assets/member-logo.png");

const MessageList = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
        {
          _id: "60c72b2f9e1d3d001c8b4fa3",
          sender: "Alice Johnson",
          amount: 4500,
          image: "https://via.placeholder.com/150",
          message: "Alice’s cheque for February.",
          time: "10:30",
        },
        {
          _id: "60c72b2f9e1d3d001c8b4fa4",
          sender: "Bob Smith",
          amount: 2800,
          image: "https://via.placeholder.com/150",
          message: "Bob’s cheque for January.",
          time: "09:45",
        },
        {
          _id: "60c72b2f9e1d3d001c8b4fa5",
          sender: "Charlie Brown",
          amount: 3700,
          image: "https://via.placeholder.com/150",
          message: "Charlie’s cheque for March.",
          time: "14:20",
        },
        {
          _id: "60c72b2f9e1d3d001c8b4fa6",
          sender: "Daisy White",
          amount: 5200,
          image: "https://via.placeholder.com/150",
          message: "Daisy’s cheque for March.",
          time: "16:55",
        },
        {
          _id: "60c72b2f9e1d3d001c8b4fa7",
          sender: "Edward King",
          amount: 3100,
          image: "https://via.placeholder.com/150",
          message: "Edward’s cheque for April.",
          time: "18:10",
        },
        {
          _id: "60c72b2f9e1d3d001c8b4fa8",
          sender: "Fiona Stone",
          amount: 4200,
          image: "https://via.placeholder.com/150",
          message: "Fiona’s cheque for February.",
          time: "20:15",
        },
        {
          _id: "60c72b2f9e1d3d001c8b4fa9",
          sender: "George Scott",
          amount: 2900,
          image: "https://via.placeholder.com/150",
          message: "George’s cheque for March.",
          time: "12:05",
        },
        {
          _id: "60c72b2f9e1d3d001c8b4fa10",
          sender: "Hannah Clark",
          amount: 5100,
          image: "https://via.placeholder.com/150",
          message: "Hannah’s cheque for April.",
          time: "13:30",
        },
        {
          _id: "60c72b2f9e1d3d001c8b4fa11",
          sender: "Ian McDonald",
          amount: 2750,
          image: "https://via.placeholder.com/150",
          message: "Ian’s cheque for January.",
          time: "15:45",
        },
        {
          _id: "60c72b2f9e1d3d001c8b4fa12",
          sender: "Judy Lane",
          amount: 4300,
          image: "https://via.placeholder.com/150",
          message: "Judy’s cheque for February.",
          time: "17:20",
        },
        {
          _id: "60c72b2f9e1d3d001c8b4fa13",
          sender: "Kevin Carter",
          amount: 6000,
          image: "https://via.placeholder.com/150",
          message: "Kevin’s cheque for March.",
          time: "19:25",
        },
        {
          _id: "60c72b2f9e1d3d001c8b4fa14",
          sender: "Laura Hill",
          amount: 3300,
          image: "https://via.placeholder.com/150",
          message: "Laura’s cheque for April.",
          time: "22:05",
        },
        {
          _id: "60c72b2f9e1d3d001c8b4fa15",
          sender: "Mark Evans",
          amount: 4900,
          image: "https://via.placeholder.com/150",
          message: "Mark’s cheque for March.",
          time: "23:50",
        },
      ],
    };
    

    setMessages(dummyData.cheques);
    setFilteredMessages(dummyData.cheques);
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
      // Toggle selection if "Select All" is active
      setSelectedMessages((prevSelected) =>
        prevSelected.includes(messageId)
          ? prevSelected.filter((id) => id !== messageId)
          : [...prevSelected, messageId]
      );
    } else {
      // Open popup if "Select All" is not active
      const message = messages.find((msg) => msg._id === messageId);
      setSelectedMessage(message);
    }
  };

  const handleReceive = async () => {
    // Bulk "Receive" action
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => !selectedMessages.includes(msg._id))
    );
    setSelectedMessages([]);
    setIsSelectAll(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = messages.filter((msg) =>
      msg.sender.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMessages(filtered);
  };

  const handleReceiveSingle = (messageId) => {
    // Handle single message "Receive"
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg._id !== messageId)
    );
    setSelectedMessage(null);
  };

  const handleRejectSingle = (messageId) => {
    // Handle single message "Reject"
    setSelectedMessage(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <MaterialIcons name="search" size={20} color="#333" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search by sender name"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.selectAllContainer}>
        <TouchableOpacity onPress={handleSelectAll} style={styles.selectAllButton}>
          <Text style={styles.selectAllText}>
            {isSelectAll ? "Deselect All" : "Select All"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleReceive}
          style={[
            styles.receiveButton,
            { backgroundColor: selectedMessages.length === 0 ? "#A9A9A9" : "#288E0F" },
          ]}
          disabled={selectedMessages.length === 0}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item._id}
        renderItem={({ item: msg }) => (
          <TouchableOpacity
            onPress={() => handleSelectMessage(msg._id)}
            style={[styles.messageCard, selectedMessages.includes(msg._id) && styles.selectedMessageCard]}
          >
            {selectedMessages.includes(msg._id) && (
              <MaterialIcons name="check-circle" size={24} color="#26CC00" style={styles.checkIcon} />
            )}
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
                <MaterialIcons name="close" size={24} color="#555" />
              </TouchableOpacity>
              <Image source={{ uri: selectedMessage.image }} style={styles.chequeImage} />
              <Text style={styles.modalMessage}>{selectedMessage.message}</Text>
              <View style={styles.modalButtons}>
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
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchIcon: { paddingRight: 10 },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 10,
  },
  selectAllContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  selectAllButton: { padding: 10, backgroundColor: "#288E0F", borderRadius: 50 },
  selectAllText: { color: "#fff" },
  receiveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  messageCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#CBCFD2",
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedMessageCard: { borderWidth: 2, borderColor: "#26CC00" },
  checkIcon: { marginRight: 10 },
  avatarContainer: {
    backgroundColor: "#F2F2F2",
    padding: 7,
    borderRadius: 25,
    marginRight: 10,
  },
  avatar: { width: 30, height: 30, borderRadius: 20 },
  messageContent: { flex: 1 },
  senderName: { color: "#333", fontWeight: "bold" },
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
  modalMessage: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  modalButtons: { flexDirection: "row", justifyContent: "space-around", width: "100%" },
});

export default MessageList;
