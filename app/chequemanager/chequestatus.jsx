import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getAllMemberCheques } from '../../serverRequest.js';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 
  'August', 'September', 'October', 'November', 'December'
];

const filterOptions = ['all', 'received', 'rejected', 'posted'];

const MembersCheque = () => {
  const [cheques, setCheques] = useState([]);
  const [expandedMonths, setExpandedMonths] = useState({});
  const [filters, setFilters] = useState(
    months.reduce((acc, month) => {
      acc[month] = 'all';
      return acc;
    }, {})
  );
  const [selectedYear, setSelectedYear] = useState('2024');

  const membersCheques = async () => {
    try {
      const response = await getAllMemberCheques();
      setCheques(response.data.cheques);
    } catch (error) {
      console.error('Error fetching cheques:', error);
    }
  };

  useEffect(() => {
    membersCheques();
  }, [selectedYear]);

  const toggleMonth = (month) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [month]: !prev[month],
    }));
  };

  const handleFilterSelect = (month, filter) => {
    setFilters((prev) => ({
      ...prev,
      [month]: filter,
    }));
  };

  const getFilteredCheques = (month) => {
    const selectedFilter = filters[month];
    return cheques.filter(
      (cheque) =>
        cheque.year == selectedYear &&
        cheque.month == month &&
        (selectedFilter === 'all' || cheque.status == selectedFilter)
    );
  };

  const renderEmptyMessage = (month, filter) => {
    const filteredCheques = getFilteredCheques(month);
    if (filteredCheques.length === 0) {
      return (
        <View style={styles.emptyMessageContainer}>
          <FontAwesome name="frown-o" size={30} color="#999" />
          <Text style={styles.emptyMessageText}>
            No cheques found for {filter === 'all' ? '' : filter} {month}.
          </Text>
        </View>
      );
    }
    return null;
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
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
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
                {month}
              </Text>
              <FontAwesome
                name={expandedMonths[month] ? 'angle-down' : 'angle-right'}
                size={20}
                color="#333"
              />
            </TouchableOpacity>

            {/* Filter Options */}
            {expandedMonths[month] && (
              <View style={styles.filterContainer}>
                {filterOptions.map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    onPress={() => handleFilterSelect(month, filter)}
                    style={[styles.filterButton, filters[month] === filter && styles.filterButtonSelected]}
                  >
                    <Text style={styles.filterText}>
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Empty Message for Filters */}
            {expandedMonths[month] && renderEmptyMessage(month, filters[month])}

            {/* List of Cheques */}
            {expandedMonths[month] && (
              <FlatList
                data={getFilteredCheques(month)}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={[styles.messageContainer, item.status === 'posted' && styles.posted]}>
                    <Text style={styles.memberName}>{item.memberName}</Text>
                    <Text style={styles.message}>
                      {item.month} {item.year} Cheque - {item.status}
                    </Text>
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
    backgroundColor: '#f9f9f9',
  },
  scrollView: {
    flex: 1,
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  dropdownLabel: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  yearPicker: {
    width: 150,
  },
  monthSection: {
    marginBottom: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  monthButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
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
    color: '#fff',
  },
  messageContainer: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#e3e3e3',
    borderRadius: 8,
  },
  posted: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  memberName: {
    fontWeight: 'bold',
  },
  message: {
    color: '#555',
  },
  emptyMessageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  emptyMessageText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default MembersCheque;
