import { View, Text } from 'react-native'
import { Redirect } from 'expo-router';
import React from 'react'

const index = () => {

  if (true) {
    // return <Redirect href="/(auth)/signup" />;
    // return <Redirect href="/chequemanager/chequedetail" />;
    return <Redirect href="/branchmanager/chequedetail" />;
  }

  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default index