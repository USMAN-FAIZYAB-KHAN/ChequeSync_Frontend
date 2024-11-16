import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const chequesData = [
    { id: '2', memberName: 'Ali', month: 'April', year: '2024', status: 'received' },
    { id: '3', memberName: 'Sara', month: 'May', year: '2024', status: 'rejected' },
    { id: '4', memberName: 'Ahmed', month: 'March', year: '2023', status: 'received' },
    { id: '5', memberName: 'Zara', month: 'April', year: '2023', status: 'rejected' },
];

const years = ['2023', '2024'];
const months = ['January', 'February','March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const filterOptions = ['all', 'received', 'rejected'];

const MembersCheque = () => {
    const [expandedMonths, setExpandedMonths] = useState({});
    const [filters, setFilters] = useState({
        March: 'all',
        April: 'all',
        May: 'all',
    });
    const [selectedYear, setSelectedYear] = useState('2024');

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
        const selectedFilter = filters[month] || 'all';
        return chequesData.filter((cheque) => {
            const isMatchingYear = cheque.year === selectedYear;
            const isMatchingMonth = cheque.month === month;
            const isMatchingStatus = selectedFilter === 'all' || cheque.status === selectedFilter;
            return isMatchingYear && isMatchingMonth && isMatchingStatus;
        });
    };

    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
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
                        {years.map((year) => (
                            <Picker.Item key={year} label={year} value={year} />
                        ))}
                    </Picker>
                </View>

                {/* Month Sections */}
                <View style={styles.navigationContainer}>
                    {months.map((month) => (
                        <View key={month} style={styles.monthSection}>
                            <TouchableOpacity onPress={() => toggleMonth(month)} style={styles.monthButton}>
                                <Text style={styles.monthText}>
                                    {expandedMonths[month] ? `↓ ${month}` : `↑ ${month}`}
                                </Text>
                            </TouchableOpacity>

                            {/* Filter Buttons for each month */}
                            {expandedMonths[month] && (
                                <View style={styles.filterContainer}>
                                    {filterOptions.map((filter) => (
                                        <TouchableOpacity
                                            key={filter}
                                            onPress={() => handleFilterSelect(month, filter)}
                                            style={[
                                                styles.filterButton,
                                                filters[month] === filter && styles.filterButtonSelected,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.filterText,
                                                    filters[month] === filter && styles.filterTextSelected,
                                                ]}
                                            >
                                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {/* Dropdown Cheque List */}
                            {expandedMonths[month] && (
                                <FlatList
                                    data={getFilteredCheques(month)}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <View
                                            style={[
                                                styles.messageContainer,
                                                item.status === 'received'
                                                    ? styles.received
                                                    : item.status === 'rejected'
                                                    ? styles.rejected
                                                    : null,
                                            ]}
                                        >
                                            <Text style={styles.memberName}>{item.memberName}</Text>
                                            <Text style={styles.message}>
                                                {item.month} {item.year} Cheque -{' '}
                                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                            </Text>
                                        </View>
                                    )}
                                />
                            )}
                        </View>
                    ))}
                </View>
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
    received: {
        borderWidth: 2,
        borderColor: 'green',
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
