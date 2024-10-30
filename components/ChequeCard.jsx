import React from 'react';
import { View, Text } from 'react-native';

// Function to get border color based on status
const getBorderColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'border-yellow-500'; // Yellow for pending
    case 'Approved':
      return 'border-green-600'; // Dark green for approved
    case 'Rejected':
      return 'border-red-600'; // Dark red for rejected
    default:
      return 'border-gray-400'; // Default gray border
  }
};

const ChequeCard = ({ id, amount, date, status }) => {
  return (
    <View className={`p-5 rounded-lg border-2 mb-3 bg-gray-100 shadow-md ${getBorderColor(status)}`}>
      
      {/* Date Row */}
      <View className="flex flex-row-reverse items-center gap-2 mb-3">
        <Text className="font-semibold text-gray-700">{date}</Text>
        <Text className="text-gray-500">Date:</Text>
      </View>

      {/* Payee Name */}
      <View className="flex flex-row gap-2 items-center mb-3">
        <Text className="text-gray-500 w-14">Name:</Text>
        <View className="grow">
          <Text className="text-lg font-semibold text-gray-800">Usman Faizyab</Text>
          <View className="h-0.5 bg-gray-400 mt-1" />
        </View>
      </View>

      {/* Month and Amount */}
      <View className="flex flex-row justify-between items-center mb-3">
        <View className="flex flex-row items-center gap-2">
          <Text className="text-gray-500 w-14">Month:</Text>
          <View className="">
            <Text className="text-lg font-semibold text-gray-800">January</Text>
            <View className="h-0.5 bg-gray-400 mt-1" />
          </View>        
        <Text className="border border-gray-400 bg-gray-200 rounded-md px-4 py-2 text-gray-800 font-medium">{amount} Rs</Text>
        </View>
      </View>

      {/* Status */}
      <View className="flex flex-row gap-2 items-center">
        <Text className="text-gray-500 w-14">Status:</Text>
        <View className="grow">
          <Text className={`text-lg font-semibold ${status === 'Approved' ? 'text-green-600' : status === 'Rejected' ? 'text-red-600' : 'text-yellow-500'}`}>{status}</Text>
          <View className="h-0.5 bg-gray-400 mt-1" />
        </View>
      </View>
    </View>
  );
};

export default ChequeCard;
