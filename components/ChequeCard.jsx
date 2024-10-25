import React from 'react';
import { View, Text } from 'react-native';

// Function to get border color based on status
const getBorderColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'border-orange-500'; // Orange for pending
    case 'Approved':
      return 'border-green-500'; // Green for approved
    case 'Rejected':
      return 'border-red-500'; // Red for rejected
    default:
      return 'border-gray-300'; // Default border color
  }
};

const ChequeCard = ({ id, amount, date, status }) => {
  return (
    <View className={`p-4 rounded-lg border-2 mb-3 bg-white shadow ${getBorderColor(status)}`}>
      <View className="flex flex-row-reverse gap-2">
        <Text className="font-bold bg-blue-200">10/12/2024</Text>
        <Text className="text-blue-900">Date</Text>
      </View>
      <View className="flex flex-row gap-2">
        <Text className="text-blue-900 w-12">Name</Text>
        <Text className="font-bold bg-blue-200 grow">Usman Faizyab Khan</Text>
      </View>
      <View className="flex flex-row justify-between items-center">  
        <View className="flex flex-1 flex-row gap-2">  
          <Text className="text-blue-900 w-12">Month</Text>
          <Text className="font-bold bg-blue-200 grow">January</Text>
        </View> 
        <Text className="me-4 border border-2 border-black rounded px-4 py-2">{amount} Rs</Text>
      </View>
      <View className="flex flex-row gap-2">  
        <Text className="text-blue-900 w-12">Status</Text>
        <Text className="font-bold bg-blue-200">{status}</Text>
      </View> 

    </View>
  );
};

export default ChequeCard;
