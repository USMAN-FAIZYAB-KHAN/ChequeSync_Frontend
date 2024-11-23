import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ChequeCard from '../../components/ChequeCard';
import { useSocket } from "../../context/socket.js"; // Adjust path as necessary

// Find ID of the user
const _id = "67350c318bf3ff24bfc3a74e";

const chequesData = [
  { id: '1', date: '2024-09-15', status: 'Pending', month: 'September' },
  { id: '2', date: '2024-10-01', status: 'Approved', month: 'October' },
  { id: '3', date: '2024-10-05', status: 'Rejected', month: 'October' },
  { id: '4', date: '2024-09-20', status: 'Approved', month: 'September' },
];

const ChequeScreen = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      // Register the user in the socket
      socket.emit("registerUser", { userId: _id });

      // Confirmation listener
      socket.on('receiveConfirmation', (message) => console.log(message));

      // Handle socket errors
      socket.on("error", (error) => {
        console.error("Socket.IO Error:", error);
      });
    }
  }, []);

  const filterCheques = () => {
    return chequesData.filter((cheque) => {
      const chequeDate = new Date(cheque.date);
      const chequeMonth = chequeDate.getMonth() + 1;
      const isStatusMatch =
        selectedStatus === "All" || cheque.status === selectedStatus;
      const isMonthMatch =
        selectedMonth === "All" || chequeMonth === parseInt(selectedMonth);
      return isStatusMatch && isMonthMatch;
    });
  };

  return (
    <View className="flex-1 p-5 bg-gray-100">
      {/* Filters Section */}
      <View className="flex-row justify-between items-center mb-5">
        {/* Status Picker */}
        <View className="flex-1 mx-2">
          <Text className="text-lg font-semibold mb-2 text-gray-700">Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedStatus}
              onValueChange={(itemValue) => setSelectedStatus(itemValue)}
              style={styles.picker}
              dropdownIconColor="#2563eb" // Dropdown arrow color
            >
              <Picker.Item label="All" value="All" />
              <Picker.Item label="Pending" value="Pending" />
              <Picker.Item label="Approved" value="Approved" />
              <Picker.Item label="Rejected" value="Rejected" />
            </Picker>
          </View>
        </View>

        {/* Month Picker */}
        <View className="flex-1 mx-2">
          <Text className="text-lg font-semibold mb-2 text-gray-700">Month</Text>
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
              {/* Add other months as needed */}
            </Picker>
          </View>
        </View>
      </View>

      {/* Cheque List */}
      <FlatList
        data={filterCheques()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChequeCard id={item.id} date={item.date} status={item.status} month={item.month} />
        )}
        className="bg-white rounded-lg shadow-md"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb', // Tailwind gray-300
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // For Android shadow
  },
  picker: {
    height: 50,
    paddingHorizontal: 10,
    color: '#374151', // Tailwind gray-700
    fontSize: 16,
    fontFamily: 'System',
  },
});

export default ChequeScreen;
