// screens/ChequeScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ChequeCard from '../../components/ChequeCard';
import { useSocket } from "../../context/socket.js"; // Adjust path as necessary


//Find id of the user
const _id = "67350024a70877fe03ff5052"

const chequesData = [
  { id: '1', amount: 1500, date: '2024-09-15', status: 'Pending' },
  { id: '2', amount: 2500, date: '2024-10-01', status: 'Approved' },
  { id: '3', amount: 1800, date: '2024-10-05', status: 'Rejected' },
  { id: '4', amount: 3200, date: '2024-09-20', status: 'Approved' },
];



const ChequeScreen = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const socket = useSocket()
  
  useEffect(()=>{
    if (socket) {

      // It is used to register the user in the socket 
      socket.emit("registerUser", {userId: _id});
      //Used for confirmation
      socket.on('receiveConfirmation', (message)=>console.log(message))

      // Handle socket errors
      socket.on("error", (error) => {
        console.error("Socket.IO Error:", error);
      });
    }
    },[])

  const filterCheques = () => {
    return chequesData.filter(cheque => {
      const chequeDate = new Date(cheque.date);
      const chequeMonth = chequeDate.getMonth() + 1;
      const isStatusMatch = selectedStatus === 'All' || cheque.status === selectedStatus;
      const isMonthMatch = selectedMonth === 'All' || chequeMonth === parseInt(selectedMonth);
      return isStatusMatch && isMonthMatch;
    });
  };

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <View className="flex-row justify-between items-center mb-5">
        <View className="flex-1 mx-2">
          <Text className="text-lg font-semibold mb-2">Status:</Text>
          <View className="bg-white rounded-lg border border-gray-300 shadow-md">
            <Picker
              selectedValue={selectedStatus}
              onValueChange={(itemValue) => setSelectedStatus(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="All" value="All" />
              <Picker.Item label="Pending" value="Pending" />
              <Picker.Item label="Approved" value="Approved" />
              <Picker.Item label="Rejected" value="Rejected" />
            </Picker>
          </View>
        </View>

        <View className="flex-1 mx-2">
          <Text className="text-lg font-semibold mb-2">Month:</Text>
          <View className="bg-white rounded-lg border border-gray-300 shadow-md">
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
              style={styles.picker}
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

      <FlatList
        data={filterCheques()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChequeCard id={item.id} amount={item.amount} date={item.date} status={item.status} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    height: 50,
    width: '100%',
  },
});

export default ChequeScreen;