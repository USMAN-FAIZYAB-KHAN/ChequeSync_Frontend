import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';


import { logInRequest } from '../../serverRequest';
import { auth } from '../../global/global';



const SignInForm = () => {
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();



  const handleSignIn = async () => {
    if (!userEmail || !password) {
      alert('Please enter both username and password.');
      return;
    }

    let data = {
      userEmail: userEmail,
      password: password
    }
    console.log(data)

    try {
      const res = await logInRequest(data);

      if (typeof res === 'string' && res.includes('not_exists')) {
        alert('User Not Found With This Credentials');
        return;
      } else if (typeof res === 'string' && res.includes('inv_cred')) {
        alert('Invalid Credentials');
        return;
      }

      if (res.statusCode === 200) {
        const { accessToken, refreshToken, user } = res.data;
        const typeUser = res.data.user.type.toLowerCase(); // Normalize user type to lowercase

        console.log(typeUser);

        // Save tokens securely
        await SecureStore.setItemAsync('accessToken', accessToken);
        await SecureStore.setItemAsync('refreshToken', refreshToken);
        await SecureStore.setItemAsync('id', res.data.user._id);
        console.log("userRole", typeUser)
        await SecureStore.setItemAsync('userRole', typeUser);

        console.log(res.data.user._id)
        auth.id = await res.data.user._id
        auth.accessToken = await accessToken
        auth.refreshToken = await refreshToken

        const accessToken1 = await SecureStore.getItemAsync('accessToken');
        console.log("when sign in", accessToken)


        // Handle navigation based on user type
        switch (typeUser) {
          case 'member':
            router.push('/member/cheque');
            break;
          case 'branchmanager':
            router.push('/branchmanager/chequedetail');
            break;
          case 'chequemanager':
            router.push('/chequemanager/chequedetail');
            break;
          default:
            alert('Unknown user type.');
        }
      } else {
        alert('Failed to sign in. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during sign-in. Please try again later.');
    }



  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={userEmail}
        onChangeText={setUserEmail}
        keyboardType="username-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  regularText: {
    fontSize: 16,
    color: '#333',
  },
  signupText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '500',
  },
});

export default SignInForm;
