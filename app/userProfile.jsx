import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator, // For the loading indicator
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { updatepassword, checkoldpassword } from "../serverRequest.js"; // Ensure you have this imported to handle the password update
import * as SecureStore from 'expo-secure-store';
import { auth } from "../global/global.js";

const UserProfile = () => {
  const [profileImage, setProfileImage] = useState("");
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [oldPasswordInput, setOldPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state
  const router = useRouter();

  const { userId, Type, username, email } = useLocalSearchParams();

  const getUserProfileRoute = (Type) => {
    switch (Type) {
      case "member":
        return "/member/cheque";
      case "chequeManager":
        return "/chequemanager/chequedetail";
      case "branchManager":
        return "/branchmanager/chequedetail";
      default:
        return "/userProfile";
    }
  };

  // Function to pick image from the gallery
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access media library is required!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri); // Update profile image
    }
  };

  // Function to handle password change
  const handlePasswordChange = async () => {
    if (newPasswordInput !== confirmPasswordInput) {
      alert("Error", "New password and confirm password do not match!");
      return;
    }

    setLoading(true); // Show loading spinner

    const isOldPasswordValid = async () => {
      const Response = await checkoldpassword(userId, oldPasswordInput);
      if (!(Response.data.message === "Success")) {
        alert("Error", "Old password is incorrect!");
        setLoading(false); // Hide loading spinner
        return;
      }

      const updateResponse = await updatepassword(userId, confirmPasswordInput);
      if (updateResponse.data.message === "Success") {
        alert("Success", "Password updated successfully!");
        setPasswordModalVisible(false);
      } else {
        alert("Error", "Failed to update password. Please try again.");
      }
      setLoading(false); // Hide loading spinner
    };
    isOldPasswordValid();
  };


  const logout = async() => {

    console.log("1")
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('id');
    await SecureStore.deleteItemAsync('userRole');
    console.log("2")
    auth.id = null
    auth.accessToken = null
    auth.refreshToken = null
    console.log("3")

    router.push('/(auth)/signin')
  }

  return (
    <View style={styles.container} className={'flex h-full justify-center'}>
      {/* Profile Image */}
      <TouchableOpacity onPress={pickImage}>
        <Image source={{ uri: profileImage || "https://via.placeholder.com/50" }} style={styles.profileImage} />
        <Text style={styles.editImageText}>Tap to Change Picture</Text>
      </TouchableOpacity>

      {/* User Information */}
      <View style={styles.infoCard}>
        <FontAwesome
          name="user"
          size={20}
          color="#007bff"
          style={styles.icon}
        />
        <View>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{username}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <FontAwesome
          name="envelope"
          size={20}
          color="#007bff"
          style={styles.icon}
        />
        <View>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{email}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <FontAwesome
          name="lock"
          size={20}
          color="#007bff"
          style={styles.icon}
        />
        <View>
          <Text style={styles.label}>Password</Text>
          <TouchableOpacity onPress={() => setPasswordModalVisible(true)}>
            <Text style={styles.updatePasswordText}>Update Password</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push(getUserProfileRoute(Type))}
      >
        <Text style={styles.buttonText}>Go to Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity 
      style={styles.logoutButton}
      onPress={logout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Password Update Modal */}
      <Modal
        visible={passwordModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPasswordModalVisible(false)}
            >
              <FontAwesome name="close" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Update Password</Text>
            <TextInput
              placeholder="Old Password"
              style={styles.input}
              value={oldPasswordInput}
              onChangeText={setOldPasswordInput}
            />
            <TextInput
              placeholder="New Password"
              style={styles.input}
              value={newPasswordInput}
              onChangeText={setNewPasswordInput}
            />
            <TextInput
              placeholder="Confirm Password"
              style={styles.input}
              value={confirmPasswordInput}
              onChangeText={setConfirmPasswordInput}
            />
            <TouchableOpacity
              style={styles.changePasswordButton}
              onPress={handlePasswordChange}
            >
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>

            {/* Loading spinner */}
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Updating password...</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 10,
  },
  editImageText: {
    textAlign: "center",
    color: "#007bff",
    marginBottom: 20,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
  },
  value: {
    fontSize: 14,
    color: "#777",
  },
  updatePasswordText: {
    color: "#007bff",
    fontSize: 14,
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  changePasswordButton: {
    backgroundColor: "#007bff",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f44336",
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#007bff",
    fontSize: 16,
  },primaryButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  }
});

export default UserProfile;
