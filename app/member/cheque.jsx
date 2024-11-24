import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import ChequeCard from "../../components/ChequeCard";
import { useSocket } from "../../context/socket.js"; // Adjust path as necessary
import { getmembersCheque } from "../../serverRequest.js";

// Find ID of the user
const _id = "67350c318bf3ff24bfc3a74e";

const ChequeScreen = () => {
  const [membercheques, setmembercheques] = useState([]);

  useEffect(() => {
    const calling = async () => {

      const result = await getmembersCheque();
      setmembercheques(result.data);
    }

    calling()
  }, []);

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Register user when socket connects
    socket.emit("registerUser", { userId: _id });

    // Listener for confirmation
    const handleConfirmation = (message) => {
      console.log("Confirmation received:", message);
    };

    // Listener for notifications
    const handleNotification = (message) => {
      console.log("Notification received:", message);
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

  const filterCheques = () => {
    return membercheques ? membercheques.filter((cheque) => {
      const isStatusMatch =
        selectedStatus == "All" || cheque.status == selectedStatus;

      const isMonthMatch =
        selectedMonth == "All" || cheque.month == selectedMonth;

      const isYearMatch =
        selectedYear == "All" || new Date(cheque.date).getFullYear() == selectedYear;

      return isStatusMatch && isMonthMatch && isYearMatch;
    }) : null;
  };

  return (
    <View className="flex-1 p-4 bg-gray-100">
      {/* Filters Section */}
      <View className="flex-row justify-between items-center mb-5">
        {/* Status Picker */}
        <View className="flex-1 mx-2">
          <Text className="text-lg font-semibold mb-2 text-gray-700 text-center">Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedStatus}
              onValueChange={(itemValue) => setSelectedStatus(itemValue)}
              style={styles.picker}
              dropdownIconColor="#2563eb" // Dropdown arrow color
            >
              <Picker.Item label="All" value="All" />
              <Picker.Item label="Posted" value="posted" />
              <Picker.Item label="Received" value="received" />
              <Picker.Item label="Approved" value="approved" />
              <Picker.Item label="Rejected" value="rejected" />
            </Picker>
          </View>
        </View>

        {/* Month Picker */}
        <View className="flex-1 mx-2">
          <Text className="text-lg font-semibold mb-2 text-gray-700 text-center">Month</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
              style={styles.picker}
              dropdownIconColor="#2563eb"
            >
              <Picker.Item label="All" value="All" />
              <Picker.Item label="January" value="1" />
              <Picker.Item label="February" value="2" />
              <Picker.Item label="March" value="3" />
              <Picker.Item label="April" value="4" />
              <Picker.Item label="May" value="5" />
              <Picker.Item label="June" value="6" />
              <Picker.Item label="July" value="7" />
              <Picker.Item label="August" value="8" />
              <Picker.Item label="September" value="9" />
              <Picker.Item label="October" value="10" />
              <Picker.Item label="November" value="11" />
              <Picker.Item label="December" value="12" />
            </Picker>
          </View>
        </View>

        {/* Year Picker */}
        <View className="flex-1 mx-2">
          <Text className="text-lg font-semibold mb-2 text-gray-700 text-center">Year</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedYear}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
              style={styles.picker}
              dropdownIconColor="#2563eb"
            >
              <Picker.Item label="All" value="All" />
              <Picker.Item label="2023" value="2023" />
              <Picker.Item label="2024" value="2024" />
              <Picker.Item label="2025" value="2025" />
              {/* Add other years as needed */}
            </Picker>
          </View>
        </View>
      </View>

      {/* Cheque List */}
      <FlatList
        data={filterCheques()}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ChequeCard
            id={item._id}
            date={item.date}
            status={item.status}
            month={item.month}
            image={item.image}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb", // Tailwind gray-300
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // For Android shadow
  },
  picker: {
    height: 50,
    paddingHorizontal: 10,
    color: "#374151", // Tailwind gray-700
    fontSize: 16,
    fontFamily: "System",
  },
});

export default ChequeScreen;
