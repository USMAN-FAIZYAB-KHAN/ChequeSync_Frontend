// screens/ChequeScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Picker,
  Button,
} from 'react-native';
import ChequeCard from '../../components/ChequeCard'; // Import ChequeCard

const chequesData = [
  { id: '1', amount: 1500, date: '2024-09-15', status: 'Pending' },
  { id: '2', amount: 2500, date: '2024-10-01', status: 'Approved' },
  { id: '3', amount: 1800, date: '2024-10-05', status: 'Rejected' },
  { id: '4', amount: 3200, date: '2024-09-20', status: 'Approved' },
  // Add more cheque objects as needed
];

const ChequeScreen = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');

  // Function to filter cheques based on selected status and month
  const filterCheques = () => {
    return chequesData.filter(cheque => {
      const chequeDate = new Date(cheque.date);
      const chequeMonth = chequeDate.getMonth() + 1; // Months are 0-indexed
      const chequeYear = chequeDate.getFullYear();
      
      const isStatusMatch = selectedStatus === 'All' || cheque.status === selectedStatus;
      const isMonthMatch = selectedMonth === 'All' || chequeMonth === parseInt(selectedMonth);

      return isStatusMatch && isMonthMatch;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Uploaded Cheques</Text>

      

      <FlatList
        data={filterCheques()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChequeCard
            id={item.id}
            amount={item.amount}
            date={item.date}
            status={item.status}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: 120,
  },
});

export default ChequeScreen;
