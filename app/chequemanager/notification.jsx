import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import { getNotifications } from "../../serverRequest.js";
import moment from 'moment'; // For formatting dates
import { useSocket } from "../../context/socket.js"; // Adjust path as necessary
import * as Notifications from "expo-notifications";

export default function Notification() {
  const [notificationsData, setNotificationData] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    // Fetch initial notifications from the server
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications("chequemanager");
        if (res.statusCode === 200) {
          setNotificationData(res.data.notificationSet);
        } else {
          Alert.alert('Notification Error', "Something Went Wrong");
        }
        console.log(res);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []); // Runs once on component mount

  useEffect(() => {
    if (!socket) return;

    const handleNotification = async (notification) => {
      console.log(notification);
    
      // Extract the message directly from the notification
      const message = notification.notification.message; // Adjusted to the correct structure
      console.log(message);
    
      try {
        if (!message) {
          console.error("Invalid notification payload");
          return;
        }

        setNotificationData((prevNotifications) => [
          notification.notification,
          ...prevNotifications, // Prepend to the list
        ]);
    
        // Schedule the notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Cheque Posted",
            body: message,
            sound: "default",
          },
          trigger: null, // This triggers the notification immediately
        });
    
        console.log("Notification scheduled successfully");
      } catch (error) {
        console.error("Error scheduling notification:", error);
      }
    };
    
    // Listener for errors
    const handleError = (error) => {
      console.error("Socket.IO Error:", error);
    };

    socket.on("receiveNotification", handleNotification);
    socket.on("error", handleError);

    // Cleanup the socket event listeners when the component unmounts
    return () => {
      socket.off("receiveNotification", handleNotification);
      socket.off("error", handleError);
    };
  }, [socket]); // Only re-run if socket changes

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      {/* Check if notificationsData exists and has length > 0 */}
      {notificationsData && notificationsData.length > 0 ? (
        <FlatList
          data={notificationsData}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()} // Use index if id is missing
          renderItem={({ item }) => (
            <View style={styles.notificationCard}>
              <Text style={styles.message}><br />{item.message}</Text>
              {/* Time in the right corner */}
              <Text style={styles.time}>
                {moment(item.updatedAt).format('MMM DD, YYYY h:mm A')}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noNotifications}>No notifications available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f9',
  },
  header: {
    fontSize: 32,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  notificationCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    position: 'relative',
  },
  message: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 5,
  },
  time: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 12,
    color: '#8e8e8e',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: '400',
  },
  noNotifications: {
    fontSize: 16,
    color: '#8e8e8e',
    textAlign: 'center',
  },
});
