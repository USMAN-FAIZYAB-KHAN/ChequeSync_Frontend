import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getAllMemberCheques } from '../../serverRequest.js';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 
  'August', 'September', 'October', 'November', 'December'
];

const filterOptions = ['all', 'received', 'rejected', 'posted'];

const MembersCheque = () => {
  const [cheques, setCheques] = useState([]); // Stores fetched cheques
  const [expandedMonths, setExpandedMonths] = useState({}); // Track expanded months
  const [filters, setFilters] = useState(
    months.reduce((acc, month) => {
      acc[month] = 'all'; // Default to 'all' filter for each month
      return acc;
    }, {})
  );
  const [selectedYear, setSelectedYear] = useState('2024'); // Default year

  // Fetch cheques when the component mounts or when year changes
  const membersCheques = async () => {
    try {
      const response = await getAllMemberCheques();
      setCheques(response.data.cheques); // Store cheques
    } catch (error) {
      console.error('Error fetching cheques:', error);
    }
  };

  useEffect(() => {
    membersCheques();
  }, [selectedYear]); // Refetch on year change

  const toggleMonth = (month) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [month]: !prev[month], // Toggle expand/collapse for month
    }));
  };

  const handleFilterSelect = (month, filter) => {
    setFilters((prev) => ({
      ...prev,
      [month]: filter, // Update filter for the month
    }));
  };

  const getFilteredCheques = (month) => {
    const selectedFilter = filters[month];
    return cheques.filter((cheque) => 
      cheque.year === selectedYear && 
      cheque.month === month &&
      (selectedFilter === 'all' || cheque.status === selectedFilter) // Apply filter
    );
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.heading}>Cheque Management</Text>

        {/* Year Dropdown */}
        <View style={styles.yearDropdownContainer}>
          <Text style={styles.dropdownLabel}>Select Year:</Text>
          <Picker
            selectedValue={selectedYear}
            onValueChange={(itemValue) => setSelectedYear(itemValue)} // Change year
            style={styles.yearPicker}
          >
            {['2023', '2024'].map((year) => (
              <Picker.Item key={year} label={year} value={year} />
            ))}
          </Picker>
        </View>

        {/* Month Sections */}
        {months.map((month) => (
          <View key={month} style={styles.monthSection}>
            <TouchableOpacity onPress={() => toggleMonth(month)} style={styles.monthButton}>
              <Text style={styles.monthText}>
                {expandedMonths[month] ? `↓ ${month}` : `↑ ${month}`}
              </Text>
            </TouchableOpacity>

            {/* Filter Options */}
            {expandedMonths[month] && (
              <View style={styles.filterContainer}>
                {filterOptions.map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    onPress={() => handleFilterSelect(month, filter)}
                    style={[
                      styles.filterButton, 
                      filters[month] === filter && styles.filterButtonSelected
                    ]}
                  >
                    <Text style={styles.filterText}>
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* List of Cheques */}
            {expandedMonths[month] && (
              <FlatList
                data={getFilteredCheques(month)}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={[styles.messageContainer, item.status === 'posted' && styles.posted]}>
                    <Text style={styles.memberName}>{item.memberName}</Text>
                    <Text style={styles.message}>{item.month} {item.year} Cheque - {item.status}</Text>
                  </View>
                )}
              />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    yearDropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dropdownLabel: {
        fontSize: 16,
        marginRight: 10,
    },
    yearPicker: {
        width: 150,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        marginTop: 10,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#ddd',
    },
    filterButtonSelected: {
        backgroundColor: '#0a8754',
    },
    filterText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
    },
    filterTextSelected: {
        color: '#fff',
    },
    navigationContainer: {
        marginBottom: 15,
    },
    monthSection: {
        marginBottom: 10,
        backgroundColor: '#F1F1F1',
        borderRadius: 5,
        padding: 9,
    },
    monthButton: {
        padding: 10,
        alignItems: 'center',
        width: '100%',
    },
    monthText: {
        fontSize: 16,
    },
    messageContainer: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#E3E3E3',
        borderRadius: 8,
        width: '100%',
    },
    posted: {
        borderWidth: 2,
        borderColor: 'blue', // Added a new color for 'posted'
    },
    rejected: {
        borderWidth: 2,
        borderColor: 'red',
    },
    memberName: {
        fontWeight: 'bold',
    },
    message: {
        color: '#555',
    },
});

export default MembersCheque;
