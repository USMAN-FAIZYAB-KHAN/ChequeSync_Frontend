
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { auth } from '../global/global';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Index = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        const role = await SecureStore.getItemAsync('userRole');
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        const id = await SecureStore.getItemAsync('id');

        console.log(accessToken, role)

        if (accessToken && role) {
          auth.id = id
          auth.accessToken = accessToken
          auth.refreshToken = refreshToken
          setUserRole(role.toLowerCase());
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };
    checkUserRole();
  }, []);



  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (userRole === 'member') {
    return <Redirect href="/member/cheque" />;
  } else if (userRole === 'branchmanager') {
    return <Redirect href="/branchmanager/chequedetail" />;
  } else if (userRole === 'chequemanager') {
    return <Redirect href="/chequemanager/chequedetail" />;
  }

  // Default: Redirect to sign-in if no valid role or token is found.
  return <Redirect href="/(auth)/signin"  />;
};

export default Index;