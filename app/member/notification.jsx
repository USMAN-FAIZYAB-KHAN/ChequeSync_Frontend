// screens/NotificationScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const notificationsData = [
  { id: '1', message: 'Cheque submitted successfully!' },
  { id: '2', message: 'New updates are available.' },
  { id: '3', message: 'Your request has been approved.' },
];

const NotificationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notificationsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text>{item.message}</Text>
          </View>
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
  notificationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
});

export default NotificationScreen;
