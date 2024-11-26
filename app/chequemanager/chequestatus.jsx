import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getAllMemberCheques } from '../../serverRequest.js';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December',
];

// Function to get month name from number (1 to 12)
const getMonthName = (monthNumber) => {
  if (monthNumber >= 1 && monthNumber <= 12) {
    return months[monthNumber - 1];
  } else {
    return null;
  }
};

const filterOptions = ['all', 'received', 'rejected'];

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
  const [loading, setLoading] = useState(false);
  const [activeMonth, setActiveMonth] = useState(null);

  const fetchChequesForMonth = async (month) => {
    try {
      setLoading(true);
      setActiveMonth(month);
      const response = await getAllMemberCheques(month, selectedYear);
      setCheques(response.data.cheques);
    } catch (error) {
      console.error(`Error fetching cheques for ${month}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMonth = (month) => {
    // Close all other months before opening the selected one
    setExpandedMonths((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (key !== month) newState[key] = false; // Close all other months
      });
      newState[month] = !newState[month]; // Toggle the selected month
      return newState;
    });

    if (!expandedMonths[month]) {
      fetchChequesForMonth(month);
    }
  };

  const getFilteredCheques = (month) => {
    const selectedFilter = filters[month];
    return cheques.filter(
      (cheque) =>
        getMonthName(cheque.month) === month &&
        cheque.year === selectedYear &&
        (selectedFilter === 'all' || cheque.status === selectedFilter)
    );
  };

  const renderEmptyMessage = (month, filter) => {
    const filteredCheques = getFilteredCheques(month);
    if (filteredCheques.length === 0 && !loading) {
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

        {/* Year Dropdown */}
        <View style={styles.yearDropdownContainer}>
          <Text style={styles.dropdownLabel}>Select Year :</Text>
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
              <Text style={styles.monthText}>{month}</Text>
              <FontAwesome
                name={expandedMonths[month] ? 'angle-down' : 'angle-right'}
                size={20}
                color="#0a8754"
              />
            </TouchableOpacity>

            {/* Filter Options */}
            {expandedMonths[month] && (
              <>
                <View style={styles.filterContainer}>
                  {filterOptions.map((filter) => (
                    <TouchableOpacity
                      key={filter}
                      onPress={() => setFilters((prev) => ({ ...prev, [month]: filter }))}
                      style={[styles.filterButton, filters[month] === filter && styles.filterButtonSelected]}
                    >
                      <Text style={styles.filterText}>
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Loading Animation */}
                {loading && activeMonth === month && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0a8754" />
                  </View>
                )}

                {/* Empty Message */}
                {renderEmptyMessage(month, filters[month])}

                {/* List of Cheques */}
                {!loading &&
                  expandedMonths[month] &&
                  getFilteredCheques(month).map((item) => (
                    <View key={item.id} style={[styles.messageContainer, item.status === 'posted' && styles.posted]}>
                      <Text style={styles.memberName}>{item.memberName}</Text>
                      <Text style={styles.message}>
                        {item.month} {item.year} Cheque - {item.status}
                      </Text>
                    </View>
                  ))}
              </>
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
    backgroundColor: '#f4f4f9',
  },
  scrollView: {
    flex: 1,
  },
  
  yearDropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent : 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dropdownLabel: {
    fontSize: 18,
    marginRight: 15,         
    color: '#333',
  },
  yearPicker: {
    fontSize: 18,
    width: 100,
  },
  monthSection: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  monthButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  monthText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0a8754',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    backgroundColor: '#ddd',
    marginRight: 20
  },
  filterButtonSelected: {
    backgroundColor: '#0a8754',
  },
  filterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  messageContainer: {
    padding: 18,
    marginVertical: 8,
    backgroundColor: '#e6f5ec',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  posted: {
    borderWidth: 2,
    borderColor: '#0a8754',
    backgroundColor: '#c6f7e2',
  },
  memberName: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 18,
  },
  message: {
    color: '#555',
    marginTop: 5,
    fontSize: 16,
  },
  loadingContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  emptyMessageContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyMessageText: {
    fontSize: 18,
    color: '#999',
    marginTop: 10,
  },
});

export default MembersCheque;
