// screens/NotificationScreen.js
import React from 'react';
import { View, Text, FlatList } from 'react-native';

const notificationsData = [
  { id: '1', message: 'Cheque submitted successfully!' },
  { id: '2', message: 'New updates are available.' },
  { id: '3', message: 'Your request has been approved.' },
];

const NotificationScreen = () => {
  return (
    <View className="flex-1 p-5 bg-gray-100">
      <Text className="text-4xl font-semibold text-gray-900 mb-6">Notifications</Text>
      <FlatList
        data={notificationsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="p-5 bg-white mb-4 rounded-lg shadow-lg border border-gray-200">
            <Text className="text-base text-gray-800 font-medium">{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default NotificationScreen;
