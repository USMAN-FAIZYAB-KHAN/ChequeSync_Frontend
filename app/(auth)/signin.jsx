import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';


import { logInRequest } from '../../serverRequest';

const SignInForm = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    // Add your sign-in logic here

    let data = {
      userName: username,
      password: password
    }

    console.log(data)

    let res = await logInRequest(data)
    console.log(res)

    if (typeof res === 'string' && res.includes('not_exists')) {

      alert('User Not Found With This Credentials');
      return;
    }
    else if (typeof res === 'string' && res.includes('inv_cred')) {

      alert('Invalid Credential');
      return;
    }

    else if (res.statusCode === 200) {
      // navigation.navigate('signin');]
      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken;
      const typeUser = res.data.user.type //check for member
      
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      
      if (typeUser.toLowerCase() == 'member') {
        router.push('/member/cheque')
      } else if (typeUser.toLowerCase() == 'branchmanager') {
        
        router.push('/branchmanager/chequedetail')
      }
      else if (typeUser.toLowerCase() == 'branchManager') {
        pass
      }
      else if (typeUser.toLowerCase() == "chequeManager") {
        router.push('chequemanager/chequedetail')
      }


      return;
    }

    console.log('username:', username);
    console.log('Password:', password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="username"
        value={username}
        onChangeText={setUsername}
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

      <View style={styles.signupTextContainer}>
        <Text style={styles.regularText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
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
