import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const LoginScreen = ({ setIsLoggedIn, setName }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL;

  const navigation = useNavigation(); // to go to register / home screen

  const handleLogin = async (e) => {
    // Simple validation
    if (!username || !password) {
      setModalVisible(true);
      return;
    }

    e.preventDefault();
    try {
      const response = await axios.post(`${SERVER_URL}/login`, {
        username,
        password,
      });

      // Simulate login success
      if (response.status === 200) {
        setIsLoggedIn(true); // Update login state
        setName(username);
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }], // Reset stack and navigate to MainTabs
        });
      }
    } catch (error) {
      // show error message if error
      if (error.response && error.response.status === 401) {
        setErrorMessage(error.response.data.error); // Set error message from backend
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#777"
        onChangeText={setUsername}
        value={username}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#777"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      {/* Show Error if any */}
      {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}

      <Text style={styles.footerText}>
        Don’t have an account?{' '}
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}> Sign up</Text>
        </TouchableOpacity>
      </Text>

      {/* Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Please enter both username and password</Text>
            <View
              style={styles.modalButton}
              onStartShouldSetResponder={() => true}
              onResponderRelease={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f3ebe1',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#7B3F00',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#555',
  },
  link: {
    color: '#7B3F00',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    color: '#4b382a',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#7B3F00',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
