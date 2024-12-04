import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const HomeScreen = ({ name }) => {
  const [popularItems, setPopularItems] = useState([]);
  const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL;
  const [preferenceItems, setPreferenceItems] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch popular items from the API
    axios
      .get('https://fake-coffee-api.vercel.app/api?limit=3')
      .then((response) => {
        setPopularItems(response.data);
      })
      .catch((error) => {
        console.error('Error fetching popular items:', error);
      });
  }, []);

  // fetch preference Item
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/preference`, {
          params: { username: name },
        });
        setPreferenceItems(response.data);
      } catch (error) {
        console.error('Error:', error.response.data.error);
      }
    };

    if (name) fetchUserData();
  }, [name]);

  const renderPopularItem = (item) => (
    <TouchableOpacity
      key={item.key}
      onPress={() => navigation.navigate('Details', { coffee: item })}
      style={styles.itemContainer}>
      <Image source={{ uri: item.image_url }} style={styles.itemImage} />
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to{'\n'}Coffee Explorer!</Text>
        <Text style={styles.subText}>
          Discover exceptional flavors {'\n'}from around the world
        </Text>
      </View>

      {/* Coffee Facts */}
      <View style={styles.factsSection}>
        <Text style={styles.sectionTitle}>Did You Know?</Text>
        <Text style={styles.factText}>
          The roast level affects both flavor and aroma!
        </Text>
        <Text style={styles.factText}>
          Try different grind options to enhance your brew.
        </Text>
      </View>

      {/* If login show preference else suggest sign up */}
      <View style={styles.popularSection}>
        <Text style={styles.sectionTitle}>Just For You</Text>
        {name ? (
          preferenceItems.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {preferenceItems.map((item, index) =>
                renderPopularItem({ ...item, key: item.id || index })
              )}
            </ScrollView>
          ) : (
            <Text style={styles.factText}>
              {/* If there is no preference found */}
              Please wait for our new product
            </Text>
          )
        ) : (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.menuButtonText}>Sign in to see</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Popular Section */}
      <View style={styles.popularSection}>
        <Text style={styles.sectionTitle}>Popular Choices</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {popularItems.map((item, index) =>
            renderPopularItem({ ...item, key: item.id || index })
          )}
        </ScrollView>
      </View>

      {/* Button Section */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('ExploreTab')}>
        <Text style={styles.menuButtonText}>Explore Coffee Options</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('FAQ')}>
        <Text style={styles.menuButtonText}>FAQ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3ebe1',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#7B3F00',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  subText: {
    fontSize: 16,
    color: '#f1e0d6',
    marginTop: 15,
    textAlign: 'center',
  },
  popularSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4b382a',
    marginBottom: 15,
  },
  itemContainer: {
    width: 200,
    marginRight: 15,
    backgroundColor: '#f9f5f0',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 10,
  },
  itemImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4b382a',
    marginTop: 10,
  },
  itemPrice: {
    fontSize: 14,
    color: '#7b3f00',
    marginTop: 5,
  },
  itemDescription: {
    fontSize: 12,
    color: '#4b382a',
    marginTop: 5,
  },
  menuButton: {
    backgroundColor: '#7B3F00',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    margin: 15,
    alignItems: 'center',
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  factsSection: {
    padding: 20,
  },
  factText: {
    fontSize: 16,
    color: '#6e4f2f',
    marginVertical: 5,
  },
});

export default HomeScreen;
