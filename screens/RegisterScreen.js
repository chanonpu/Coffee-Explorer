import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Collapsible from 'react-native-collapsible';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferences: {
      roastLevel: '',
      grindOption: '',
      region: [],
      flavorProfile: [],
    },
  });

  const [isRoastCollapsed, setIsRoastCollapsed] = useState(true);
  const [isGrindCollapsed, setIsGrindCollapsed] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL;
  const navigation = useNavigation(); // to go to login screen

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    if (key === 'confirmPassword' || key === 'password') {
      if (formData.password !== value && key === 'confirmPassword') {
        setPasswordError('Passwords do not match.');
      } else {
        setPasswordError('');
      }
    }
  };

  const handlePreferenceChange = (type, value) => {
    setFormData((prev) => {
      let updatedPreference = { ...prev.preferences };
      if (type === 'region' || type === 'flavorProfile') {
        const currentList = updatedPreference[type];
        updatedPreference[type] = currentList.includes(value)
          ? currentList.filter((item) => item !== value)
          : [...currentList, value];
      } else {
        updatedPreference[type] = value;
      }
      return { ...prev, preferences: updatedPreference };
    });
  };

  // register event 
  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match.');
    } else {
      setPasswordError('');
      try {
        const response = await axios.post(`${SERVER_URL}/register`, { formData });
        navigation.navigate('Login')
      } catch (error) {
        // show error message if error
        if (error.response && error.response.status === 400) {
          setErrorMessage(error.response.data.error); // Set error message from backend
        } else {
          setErrorMessage('An unexpected error occurred. Please try again.');
        }
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Username (required)"
        placeholderTextColor="#777"
        value={formData.username}
        onChangeText={(text) => handleInputChange('username', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email (required)"
        placeholderTextColor="#777"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => handleInputChange('email', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password (required)"
        placeholderTextColor="#777"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleInputChange('password', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password (required)"
        placeholderTextColor="#777"
        secureTextEntry
        value={formData.confirmPassword}
        onChangeText={(text) => handleInputChange('confirmPassword', text)}
      />
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      <Text style={styles.sectionTitle}>Preferences</Text>

      {/* Roast Level Collapsible */}
      <TouchableOpacity
        style={styles.collapsibleHeader}
        onPress={() => setIsRoastCollapsed(!isRoastCollapsed)}
      >
        <Text style={styles.collapsibleTitle}>
          Roast Level: {formData.preferences.roastLevel || 'None'}
        </Text>
      </TouchableOpacity>
      <Collapsible collapsed={isRoastCollapsed}>
        {['Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark'].map(
          (option) => (
            <TouchableOpacity
              key={option}
              style={styles.option}
              onPress={() => {
                handlePreferenceChange('roastLevel', option);
                setIsRoastCollapsed(true);
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  formData.preferences.roastLevel === option && styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          )
        )}
      </Collapsible>

      {/* Grind Option Collapsible */}
      <TouchableOpacity
        style={styles.collapsibleHeader}
        onPress={() => setIsGrindCollapsed(!isGrindCollapsed)}
      >
        <Text style={styles.collapsibleTitle}>
          Grind Option: {formData.preferences.grindOption || 'None'}
        </Text>
      </TouchableOpacity>
      <Collapsible collapsed={isGrindCollapsed}>
        {['Whole Bean', 'Cafetiere', 'Filter', 'Espresso'].map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.option}
            onPress={() => {
              handlePreferenceChange('grindOption', option);
              setIsGrindCollapsed(true);
            }}
          >
            <Text
              style={[
                styles.optionText,
                formData.preferences.grindOption === option && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </Collapsible>

      {/* Region */}
      <Text style={styles.sectionTitle}>Region</Text>
      {[
        'Central America',
        'Africa',
        'South America',
        'Asia Pacific',
        'Middle East',
      ].map((region) => (
        <View key={region} style={styles.checkboxContainer}>
          <BouncyCheckbox
            isChecked={formData.preferences.region.includes(region)}
            onPress={() => handlePreferenceChange('region', region)}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>{region}</Text>
        </View>
      ))}

      {/* Flavor Profile */}
      <Text style={styles.sectionTitle}>Flavor Profile</Text>
      {['Citrus', 'Chocolate', 'Nutty', 'Spicy', 'Floral'].map((flavor) => (
        <View key={flavor} style={styles.checkboxContainer}>
          <BouncyCheckbox
            isChecked={formData.preferences.flavorProfile.includes(flavor)}
            onPress={() => handlePreferenceChange('flavorProfile', flavor)}
          />
          <Text style={styles.checkboxLabel}>{flavor}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      {/* Show Error if any */}
      {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f3ebe1', // Warm background color
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4a2c13', // Coffee-like color
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 2,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#7B3F00',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 15,
  },
  collapsibleHeader: {
    backgroundColor: '#e5d5c5',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  collapsibleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a2c13',
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 1,
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedOptionText: {
    color: '#7B3F00',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#4a2c13',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  checkboxLabel: {
    color: '#6e4f2f',
    fontSize: 16,
  },
});

export default RegisterScreen;