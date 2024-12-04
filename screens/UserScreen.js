import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from 'react-native-vector-icons'; // Import the icon library
import axios from 'axios';

const UserScreen = ({ setIsLoggedIn, setName, name }) => {
  const [isPreferenceCollapsed, setIsPreferenceCollapsed] = useState(true);
  const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL;
  const navigation = useNavigation(); // to go to home screen
  const [user, setUser] = useState({
    username: name,
    email: '',
    profilePicture: 'https://coffee.alexflipnote.dev/ianNZJdEGxk_coffee.jpg',
    preferences: {
      roastLevel: '',
      grindOption: '',
      region: [],
      flavorProfile: [],
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user`, {
          params: { username: name },
        });

        const { email, preferences } = response.data;
        setUser((prevUser) => ({
          ...prevUser, // Retain existing fields
          email,
          preferences,
        }));
      } catch (error) {
        console.log('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, [name]);

  // Mock data for user
  // const user = {
  //   name: 'John Doe',
  //   email: 'johndoe@example.com',
  //   profilePicture: 'https://coffee.alexflipnote.dev/ianNZJdEGxk_coffee.jpg', // Placeholder image
  //   preference: {
  //     roast_level: 3,
  //     grind_option: ['Whole Bean'],
  //     regions: ['Africa', 'Asia Pacific'],
  //     flavor_profile: ['Citrus', 'Floral'],
  //   },
  // };

  const handleLogout = () => {
    setIsLoggedIn(false); // Update login state
    setName(''); // Clear name
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }], // Reset stack and navigate to MainTabs
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          style={styles.profilePicture}
          source={{ uri: user.profilePicture }}
        />
        <Text style={styles.userName}>{user.username}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      {/* Preference Section */}

      <TouchableOpacity
        onPress={() => setIsPreferenceCollapsed(!isPreferenceCollapsed)}
        style={styles.header}>
        <AntDesign name="heart" size={30} color="#fff" style={styles.icon} />
        <Text style={styles.headerText}>Preferences</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isPreferenceCollapsed}>
        <View style={styles.content}>
          {/* Roast Level */}
          <View style={styles.preferenceContainer}>
            <Text style={styles.label}>Roast Level:</Text>
            <Text style={styles.description}>
              {user.preferences.roastLevel}
            </Text>
          </View>

          {/* Grind Option */}
          <View style={styles.preferenceContainer}>
            <Text style={styles.label}>Grind Option:</Text>
            <Text style={styles.description}>
              {user.preferences.grindOption}
            </Text>
          </View>

          {/* Regions */}
          <View style={styles.preferenceContainer}>
            <Text style={styles.label}>Regions:</Text>
            {user.preferences.region.map((region, index) => (
              <Text key={index} style={styles.description}>
                {region}
              </Text>
            ))}
          </View>

          {/* Flavor Profile */}
          <View style={styles.preferenceContainer}>
            <Text style={styles.label}>Flavor Profile:</Text>
            {user.preferences.flavorProfile.map((flavor, index) => (
              <Text key={index} style={styles.description}>
                {flavor}
              </Text>
            ))}
          </View>
        </View>
      </Collapsible>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f3ebe1',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#7B3F00',
    borderRadius: 5,
    marginBottom: 5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  content: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7B3F00',
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5,
  },
  preferenceContainer: {
    marginBottom: 10,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#8B4513',
    width: '30%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  logoutButton: {
    backgroundColor: '#FF6347',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserScreen;
