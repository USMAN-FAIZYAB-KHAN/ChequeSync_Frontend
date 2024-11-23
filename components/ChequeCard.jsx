import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'; // Import icons

// Function to get border and text color based on status
const getStatusStyles = (status) => {
  switch (status) {
    case 'Pending':
      return { borderColor: 'border-yellow-400', textColor: 'text-yellow-500' };
    case 'Approved':
      return { borderColor: 'border-green-500', textColor: 'text-green-600' };
    case 'Rejected':
      return { borderColor: 'border-red-500', textColor: 'text-red-600' };
    default:
      return { borderColor: 'border-gray-300', textColor: 'text-gray-500' };
  }
};

const ChequeCard = ({ month, date, status }) => {
  const { borderColor, textColor } = getStatusStyles(status);

  return (
    <View className={`relative p-4 rounded-lg border ${borderColor} mb-4 bg-white shadow-md`}>
      {/* Action Icons (Top Right) */}
      <View className="absolute top-3 right-3 flex flex-row gap-4">
        {/* View Icon */}
        <Pressable onPress={() => alert('View Image Pressed')}>
          <FontAwesome name="eye" size={20} color="#2563eb" />
        </Pressable>

        {/* Edit Icon (Visible only if status is Pending) */}
        {status === 'Pending' && (
          <Pressable onPress={() => alert('Edit Pressed')}>
            <MaterialIcons name="edit" size={20} color="#f59e0b" />
          </Pressable>
        )}
      </View>

      {/* Content */}
      <View className="flex flex-row justify-between mt-6" >
        {/* Date */}
        <View className="mb-3">
          <Text className="font-medium text-gray-500">Date</Text>
          <Text className="font-bold text-gray-900">{date}</Text>
        </View>

        {/* Month */}
        <View className="mb-3">
          <Text className="font-medium text-gray-500">Month</Text>
          <Text className="font-bold text-gray-900">{month}</Text>
        </View>

        {/* Status */}
        <View>
          <Text className="text-sm font-medium text-gray-500">Status</Text>
          <Text className={`font-bold ${textColor}`}>{status}</Text>
        </View>
      </View>
    </View>
  );
};

export default ChequeCard;
