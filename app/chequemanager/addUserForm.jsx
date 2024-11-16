


import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';

import { automaticSignUp, registerRequest } from '../../serverRequest';

const SignUpForm = () => {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNo, setPhoneNumber] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [verifyExcel, setVerifyExcel] = useState(false)



  useEffect(() => {
    const processExcelData = async () => {
      if (excelData) {
        try {
          // Ensure automaticSignUp is properly imported and defined
          let res = await automaticSignUp(excelData);
          console.log(res)
          if (typeof res === 'string' && res.includes('already exist')) {

            
            Alert.alert('Try Again', res);
            return;
          }
        } catch (error) {
          console.error('Error during sign-up:', error);
          Alert.alert('Error', 'An error occurred during sign-up. So Try Again');
        }
      }
    };
    console.log("in effect")
    console.log("verify: ", verifyExcel)
    if (!verifyExcel) {
      processExcelData();
    }
  }, [excelData]); // Trigger effect when excelData changes


  // Function to handle file upload (Excel only)
  const handleUploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel (xlsx)
          'application/vnd.ms-excel', // Excel (xls)
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      // Check if the file is an Excel file
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        // Ensure the selected file is an Excel file
        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          setSelectedFile(file);
          // Alert.alert('File Selected', `You have selected: ${file.name}`);
          await handleProcessExcel(file.uri); // Process the Excel file
        } else {
          Alert.alert('Invalid File Type', 'Please select a valid Excel file (.xls or .xlsx).');
        }
      } else {
        Alert.alert('No File Selected', 'You did not select any file.');
      }
    } catch (error) {
      console.error('Error selecting file:', error);
      Alert.alert('Error', 'An error occurred while selecting the file.');
    }
  };

  // Function to process the Excel file
  // const handleProcessExcel = async (fileUri) => {
  //   try {
  //     const fileContent = await FileSystem.readAsStringAsync(fileUri, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     const workbook = XLSX.read(fileContent, { type: 'base64' });
  //     const sheetName = workbook.SheetNames[0]; // Get the first sheet
  //     const sheet = workbook.Sheets[sheetName];
  //     const data = XLSX.utils.sheet_to_json(sheet);

  //     setExcelData(data);

  //     Alert.alert('Excel File Processed', 'Data has been successfully extracted from the Excel file.');
  //   } catch (error) {
  //     console.error('Error processing Excel file:', error);
  //     Alert.alert('Error', 'Failed to process the Excel file.');
  //   }
  // };

  const handleProcessExcel = async (fileUri) => {
    try {

      console.log("In process")
      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const workbook = XLSX.read(fileContent, { type: 'base64' });
      const sheetName = workbook.SheetNames[0]; // Get the first sheet
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      // Define the required columns
      const requiredColumns = ["First Name", "Last Name", "Phone Number", "UserEmail"];

      // Check for missing or misspelled columns
      const actualColumns = Object.keys(data[0] || {});
      const missingColumns = requiredColumns.filter((col) => !actualColumns.includes(col));
      console.log(actualColumns, missingColumns, requiredColumns)
      if (missingColumns.length > 0) {
        const missingColsString = missingColumns.join(", ");
        Alert.alert(
          "Missing or Misspelled Columns",
          `The following columns are missing or misspelled: ${missingColsString}. Please correct them and try again.`
        );
        setVerifyExcel(true)
        return;
      }

      // If all required columns are present, proceed with setting the data
      setExcelData(data);
      setVerifyExcel(false)

      // Alert.alert('Excel File Processed', 'Data has been successfully extracted from the Excel file.');
    } catch (error) {
      console.error('Error processing Excel file:', error);
      Alert.alert('Error', 'Failed to process the Excel file.');
    }
  };


  // Function to remove the selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setExcelData(null);
  };

  // Function to open the selected file
  const handleOpenFile = async () => {
    if (selectedFile?.uri) {
      try {
        await Linking.openURL(selectedFile.uri);
      } catch (error) {
        console.error('Error opening file:', error);
        Alert.alert('Error', 'Unable to open the file.');
      }
    }
  };

  const handleSignUp = async () => {


    // Validate phone number length and format
    if (phoneNo.length !== 11 || !/^\d+$/.test(phoneNo)) {
      alert('Phone number must be exactly 11 digits and contain only numbers');
      return;
    }

    const data = {
      userEmail: userEmail,
      firstName: firstName,
      lastName: lastName,
      phoneNo: phoneNo
    }

    let res = await registerRequest(data)
    console.log(res)
    if (typeof res === 'string' && res.includes('exists')) {

      alert('User Already Exists');
      return;
    }
    if (typeof res === 'string' && res.includes('wrong')) {

      alert('Something Went Wrong While Creating the User');
      return;
    }
    if (typeof res === 'string' && res.includes('already exist')) {

      alert(res);
      return;
    }

    else if (typeof res === 'number' && res === 409) {
      Alert.alert('Error', 'User with This Email Already Exist');
      return;
    }
    else if (typeof res === 'number' && res === 201) {
      Alert.alert('Success', 'User has been created');
      return;
    }

  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Users</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={userEmail}
        onChangeText={setUserEmail}
        keyboardType="email-address"
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
        maxLength={11}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Add User</Text>
      </TouchableOpacity>

      {selectedFile ? (
        <View style={styles.fileContainer}>
          <TouchableOpacity onPress={handleOpenFile}>
            <Text style={styles.fileName}>{selectedFile.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeButton} onPress={handleRemoveFile}>
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadFile}>
          <Text style={styles.uploadButtonText}>Upload Excel File</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F3F4F6',
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    textAlign: 'justify',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  uploadButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  fileContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginTop: 10,
  },
  fileName: {
    fontSize: 16,
    color: '#007BFF',
    marginRight: 10,
  },
  removeButton: {
    backgroundColor: '#FF4D4D',
    padding: 8,
    borderRadius: 50,
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default SignUpForm;