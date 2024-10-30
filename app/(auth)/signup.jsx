import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';


//custom files
import { registerRequest } from '../../serverRequest';

const SignUpForm = () => {

  const navigation = useNavigation();
  const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNo, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter(); // For navigation

  const handleSignUp = async () => {
    // Check for matching passwords
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Validate phone number length and format
    if (phoneNo.length !== 11 || !/^\d+$/.test(phoneNo)) {
      alert('Phone number must be exactly 11 digits and contain only numbers');
      return;
    }

    const data = {
      userName: name,
      firstName: firstName,
      lastName: lastName,
      phoneNo: phoneNo,
      password: password,
      type: 'member',
    }

    let res = await registerRequest(data)

    if (typeof res === 'string' && res.includes('exists')) {
      
      alert('User Already Exists');
      return;
    }
    if (typeof res === 'string' && res.includes('wrong')) {
      
      alert('Something Went Wrong While Creating the User');
      return;
    }  
    
    else if (typeof res === 'number' && res === 201) {
      navigation.navigate('signin');
      return;
    }



  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNo}
        onChangeText={setPhoneNumber}
        keyboardType="number-pad"
        maxLength={12} // Restrict input length to 12 characters
      />


      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.loginTextContainer}>
        <Text style={styles.regularText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/signin')}>
          <Text style={styles.loginText}>Sign In</Text>
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
    backgroundColor: '#28a745',
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
  loginTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  regularText: {
    fontSize: 16,
    color: '#333',
  },
  loginText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '500',
  },
});

export default SignUpForm;
