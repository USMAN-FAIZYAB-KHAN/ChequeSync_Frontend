import React, { useEffect, useState } from "react";
import { Tabs } from 'expo-router';
import { SocketProvider } from "../../context/socket.js";
import Header from "../header.jsx"; // You can remove this if you don't want to use the Header anymore
import { getUserdetail } from "../../serverRequest.js";
import { auth } from "../../global/global.js";
import TabBar from "../../components/TabBar.jsx";

const Layout = () => {
  const [userDetails, setUserDetails] = useState({});
  const _id = auth.id;
  const accessToken = auth.accessToken;

  const fetchgetUserdetail = async () => {
    try {
      const Response = await getUserdetail(_id, accessToken);
      const user = Response.data.user;
      
      setUserDetails({
        userId: user._id,
        Type: user.type,
        username: `${user.firstName} ${user.lastName}`,
        email: user.userEmail,
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    fetchgetUserdetail();
  }, []);

  return (
    <SocketProvider>
      {/* Remove this Header component if you no longer want to use it */}
      {Object.keys(userDetails).length > 0 && (
        <Header userDetails={userDetails} />
      )}

      <Tabs tabBar={props => <TabBar {...props}/>}>
        <Tabs.Screen 
          name="cheque" 
          options={{
            title: 'Cheque',
            tabBarIcon: { name: 'money-check-alt', size: 20, color: "#2563eb" },
            headerShown: false, 
            fontSize: "font-lg",
            color: "text-blue-600",
            underlineColor: "bg-blue-600"
          }} 
        />
        <Tabs.Screen 
          name="upload" 
          options={{
            title: 'Upload',
            tabBarIcon: { name: 'cloud-upload-alt', size: 21, color: "#2563eb" },
            headerShown: false,
            fontSize: "font-lg",
            color: "text-blue-600" ,
            underlineColor: "bg-blue-600"
          }} 
        />
        <Tabs.Screen 
          name="notification" 
          options={{
            title: 'Notification',
            tabBarIcon: { name: 'bell', size: 22, color: "#2563eb" },
            headerShown: false,
            fontSize: "font-lg",
            color: "text-blue-600",
            underlineColor: "bg-blue-600"
          }} 
        />
      </Tabs>
    </SocketProvider>
  );
};

export default Layout;
