import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome5 } from "@expo/vector-icons";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const UploadScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [amount, setAmount] = useState("");

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access the camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleSubmit = () => {
    alert("Image submitted successfully!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Cheque Image</Text>

      {/* Input fields in the same row */}
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Month</Text>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select month" value="" />
            <Picker.Item label="January" value="January" />
            <Picker.Item label="February" value="February" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter Amount</Text>
          <View style={styles.amountInputContainer}>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              placeholder="Enter amount"
              value={amount}
              onChangeText={(text) => setAmount(text)}
            />
            <Text style={styles.currencyLabel}>Rs</Text>
          </View>
        </View>
      </View>

      {selectedImage ? (
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={() => setShowFullScreen(true)}>
            <Image source={{ uri: selectedImage }} style={styles.image} />
          </TouchableOpacity>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity onPress={removeImage} style={styles.removeButton}>
              <FontAwesome5 name="trash" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={pickImage}
          style={styles.placeholderContainer}
        >
          <Text style={styles.placeholderText}>
            Click to upload or drag and drop
          </Text>
          <FontAwesome5 name="cloud-upload-alt" size={40} color="#bbb" />

          <Text style={styles.placeholderSubText}>
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </Text>
        </TouchableOpacity>
      )}

<View style={styles.buttonContainer}>
  <View style={styles.orientationHintContainer}>
    <FontAwesome5
      name="mobile-alt"
      size={30}
      color="#bbb"
      style={[styles.horizontalIndicator, { transform: [{ rotate: "90deg" }] }]}
    />
    <Text style={styles.placeholderText}>
      Please take a clear horizontal picture of the cheque
    </Text>
  </View>

  <TouchableOpacity onPress={takePhoto} style={styles.iconButton}>
    <FontAwesome5 name="camera" size={24} color="#fff" />
  </TouchableOpacity>
</View>


      <Modal
        visible={showFullScreen}
        transparent={true}
        onRequestClose={() => setShowFullScreen(false)}
      >
        <View style={styles.fullScreenContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowFullScreen(false)}
          >
            <FontAwesome5 name="times" size={24} color="#000" />
          </TouchableOpacity>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullScreenImage}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    width: "100%",
    height: 50,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    paddingRight: 10,
  },
  textInput: {
    flex: 1,
    height: 60,
    padding: 10,
  },
  currencyLabel: {
    fontSize: 16,
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    marginBottom: 20,
  },
  iconButton: {
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    marginHorizontal: 10,
  },
  placeholderContainer: {
    width: "100%",
    height: 200,
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  
  orientationHintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    flex: 1,
    flexWrap: 'wrap', // Allows text to wrap to a second line
    paddingRight: 3,
  },
  
  horizontalIndicator: {
    alignSelf: 'center', // Centers the icon vertically with text
  },
  
  placeholderText: {
    color: '#bbb',
    fontSize: 14,
    lineHeight: 18,
    flexShrink: 1,
    textAlignVertical: 'center', // Centers text vertically with the icon
  },
  
  iconButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  
  

  placeholderText: {
    textAlign: "center",
    color: "#bbb",
    fontSize: 16,
    // marginTop: 10,
  },
  placeholderSubText: {
    color: "#bbb",
    fontSize: 12,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
    width: screenWidth,
  },
  image: {
    width: 400,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  removeButton: {
    marginRight: 10,
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
  },
  submitButton: {
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 80,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  fullScreenImage: {
    width: "100%",
    height: "80%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 5,
  },
});

export default UploadScreen;
