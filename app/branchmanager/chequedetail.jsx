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
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [capturedImage, setCapturedImage] = useState(false);
  const [rejectedImages, setRejectedImages] = useState({});
  const [messageInputVisible, setMessageInputVisible] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [dummyMessages, setDummyMessages] = useState([]);
  const [defaultView, setDefaultView] = useState(true); // Default view control
  const [selectedMessage, setSelectedMessage] = useState(null);

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
    const dummyMsgs = [
      "Cheque needs verification.",
      "Invalid amount, please resubmit.",
      "Cheque rejected due to errors.",
      "Incorrect account details provided.",
    ];
    setMessages(dummyData.cheques);
    setFilteredMessages(dummyData.cheques);
    setDummyMessages(dummyMsgs);
  }, []);

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri); // Store the captured photo URI
      setMessageInputVisible(true); // Show the message input after photo capture
      setDefaultView(false); // Disable default view
      return result.assets[0].uri;
    }
    return null;
  };


  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = messages.filter((msg) =>
      msg.sender.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMessages(filtered);
  };

  // Toggle "Select All" functionality
const handleSelectAll = () => {
  setIsSelectAll((prev) => !prev);
  if (isSelectAll) {
    setSelectedMessages([]); // If Select All is deactivated, clear selected messages
  } else {
    setSelectedMessages(messages.map((msg) => msg._id)); // Select all messages
  }
};

// Handle message click (for selection/deselection or opening modal)
const handleToggleMessage = (id) => {
  if (isSelectAll) {
    // If "Select All" is active, just select/deselect the message, no modal
    setSelectedMessages((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((msgId) => msgId !== id)
        : [...prevSelected, id]
    );
  } else {
    // If "Select All" is not active, open the modal for the selected message
    const selectedMsg = messages.find((msg) => msg._id === id);
    setSelectedMessage(selectedMsg); // Open modal for the selected message
  }
};

// Select a dummy message
const handleSelectDummyMessage = (msg) => {
  setCustomMessage(msg); // Set the selected dummy message in the input box
};

// Handle receiving single message (remove it from the list)
const handleReceiveSingle = (messageId) => {
  setMessages((prevMessages) =>
    prevMessages.filter((msg) => msg._id !== messageId)
  );
  setSelectedMessage(null); // Close modal after receiving message
};

// Handle receiving multiple messages (remove selected messages from the list)
const handleReceive = () => {
  setMessages((prevMessages) =>
    prevMessages.filter((msg) => !selectedMessages.includes(msg._id))
  );
  setSelectedMessages([]); // Clear selected messages
  setIsSelectAll(false); // Deactivate Select All
};
  const handleRejectSingle = async (messageId) => {
    const photoUri = await takePhoto();
    if (photoUri) {
      setRejectedImages((prev) => ({
        ...prev,
        [messageId]: photoUri,
      }));
      setCapturedImage(true);
    }
  };

  const handleSubmit = () => {
    setCapturedImage(false);
    setCustomMessage("");
    setMessageInputVisible(false);
    setSelectedMessage(null);
  };

  const closeModal = () => {
    setSelectedMessage(null);
    setCapturedImage(false);
    setMessageInputVisible(false);
    setCustomMessage("");
    setDefaultView(true); // Reset to default view
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <MaterialIcons
          name="search"
          size={20}
          color="#333"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchBar}
          placeholder="Search by sender name"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <View style={styles.selectAllContainer}>
        <TouchableOpacity
          onPress={handleSelectAll}
          style={styles.selectAllButton}
        >
          <Text style={styles.selectAllText}>
            {isSelectAll ? "Deselect All" : "Select All"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleReceive}
          style={[
            styles.receiveButton,
            {
              backgroundColor:
                selectedMessages.length === 0 ? "#A9A9A9" : "#288E0F",
            },
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
            onPress={() =>
              handleToggleMessage(msg._id, selectedMessages.includes(msg._id))
            }
            style={[
              styles.messageCard,
              selectedMessages.includes(msg._id) && styles.selectedMessage,
            ]}
          >
            {selectedMessages.includes(msg._id) && (
              <MaterialIcons
                name="check-circle"
                size={24}
                color="#26CC00"
                style={styles.checkIcon}
              />
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
          animationType="slide"
          transparent={true}
          visible={!!selectedMessage}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <MaterialIcons name="close" size={20} color="#333" />
              </TouchableOpacity>

              <Image
                source={{
                  uri:
                    rejectedImages[selectedMessage._id] ||
                    selectedMessage.image,
                }}
                style={styles.chequeImage}
              />

              {defaultView ? (
                <>
                  <Text style={styles.modalMessage}>
                    {selectedMessage.message}
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.buttonStyle}
                      onPress={() => handleReceiveSingle(selectedMessage._id)}
                    >
                      <Text style={styles.buttonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.buttonStyle, styles.rejectButtonStyle]}
                      onPress={() => handleRejectSingle(selectedMessage._id)}
                    >
                      <Text style={styles.buttonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View>
                  <Text style={styles.messageHeading}>
                    Type or Select a Message:
                  </Text>
                  <View style={styles.dummyMessagesContainer}>
                    {dummyMessages.map((msg, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleSelectDummyMessage(msg)}
                        style={styles.dummyMessage}
                      >
                        <Text>{msg}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Type a custom message..."
                    value={customMessage}
                    onChangeText={setCustomMessage}
                  />
                  <TouchableOpacity
                    style={[
                      styles.buttonStyle,
                      { alignSelf: "center", marginTop: 10 },
                    ]}
                    onPress={handleSubmit}
                  >
                    <Text
                      style={[styles.submitButton, styles.submitButtonText]}
                    >
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
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
    padding: 20,
    backgroundColor: "#F9F9F9",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#FFF",
    borderRadius: 30,
    paddingHorizontal: 15,
    elevation: 5,
  },
  searchIcon: {
    paddingRight: 10,
    color: "#888",
  },
  searchBar: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: "#333",
    borderRadius: 30,
    paddingHorizontal: 10,
    borderColor: "none",
  },
  selectAllContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  selectAllButton: {
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: "green",
    alignItems: "center",
    elevation: 3,
    flex: 0.45,
  },
  selectAllText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  receiveButton: {
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: "#288E0F",
    alignItems: "center",
    elevation: 3,
    flex: 0.45,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  messageCard: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 10,
    elevation: 3,
  },
  selectedMessage: {
    borderColor: "#26CC00",
    borderWidth: 2,
  },
  checkIcon: {
    marginRight: 15,
    color: "#26CC00",
  },
  avatarContainer: {
    padding: 12,
    backgroundColor: "#E9E9E9",
    borderRadius: 30,
    marginRight: 18,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 22,
  },
  messageContent: {
    flex: 1,
  },
  senderName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  messageText: {
    fontSize: 12, // Reduce font size
    color: "#555",
    maxWidth: "70%", // Optionally, you can reduce the width to make it more compact
  },
  messageTime: {
    fontSize: 12,
    color: "#AAA",
    alignSelf: "flex-start",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    elevation: 10,
    // alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#EEE",
    borderRadius: 20,
    padding: 5,
  },
  chequeImage: {
    width: "90%",
    height: 180,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 20,
    resizeMode: "cover",
    alignSelf: "center",
  },
  modalMessage: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  buttonStyle: {
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    backgroundColor: "#4CAF50", // Default green button
  },
  rejectButtonStyle: {
    backgroundColor: "#F44336", // Reject red button
  },

  messageHeading: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#4A4A4A",
    marginBottom: 10,
  },
  dummyMessagesContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
  },

  dummyMessage: {
    backgroundColor: "#F9F9F9",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginBottom: 10,
    marginRight: 10,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "green",
    justifyContent: "center",
  },
  input: {
    borderWidth: 2,
    borderColor: "green",
    borderRadius: 20,
    padding: 12,
    marginTop: 10,
    backgroundColor: "#FFF",
    fontSize: 14,
    color: "#444",
    width: "100%",
    marginBottom: 10,
  },
  photoButton: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    backgroundColor: "#FFB74D",
    borderRadius: 50,
    alignItems: "center",
    marginVertical: 20,
    width: "80%",
    alignSelf: "center",
    elevation: 5,
  },
  photoButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    paddingHorizontal: 60,
    paddingBottom: 30,
    borderRadius: 50,
    alignItems: "center",
    alignSelf: "center",
    elevation: 5,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  modalContentWithMessage: {
    width: "90%",
    padding: 30,
    borderRadius: 20,
    backgroundColor: "#FFF",
    alignItems: "center",
    elevation: 15,
  },
  messageInputSection: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  customMessage: {
    width: "80%",
    height: 100,
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    fontSize: 14,
    color: "#555",
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 20,
  },
});

export default MessageList;