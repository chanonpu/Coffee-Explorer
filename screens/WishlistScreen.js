import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WishlistScreen = ({ name }) => {
  const [wishlistData, setWishlistData] = useState([]);
  const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL;
  const navigation = useNavigation(); // to go to detail screen

  // fetch wishlist Item
  useEffect(() => {
    const fetchUserData = () => {
      fetch(`${SERVER_URL}/wishlist?username=${name}`)
        .then((response) => response.json())
        .then((data) => {
          setWishlistData(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };

    if (name) fetchUserData();
  }, [name]);

  const renderCoffeeItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Details', { coffee: item })}
      style={styles.card}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your WishList</Text>

      <FlatList
        data={wishlistData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCoffeeItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.noResults}>No wishlist in your account.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f5f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5B3A29',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8B572A',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default WishlistScreen;
