import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 5,
  },
});

const tabBarOptions = {
  activeTintColor: '#6200ee',
  inactiveTintColor: '#888',
  style: styles.tabBar,
};

export default function Layout() {
  return (
    <Tabs screenOptions={tabBarOptions}>
      <Tabs.Screen 
        name="cheque" 
        options={{ 
          title: 'Cheque',
          tabBarIcon: ({ color }) => <FontAwesome5 name="money-check" size={22} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="upload" 
        options={{
          title: 'Upload',
          tabBarIcon: ({ color }) => <FontAwesome5 name="plus" size={22} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="notification" 
        options={{  
          title: 'Notification',
          tabBarIcon: ({ color }) => <FontAwesome5 name="bell" size={22} color={color} /> 
        }} 
      />
    </Tabs>
  );
}

