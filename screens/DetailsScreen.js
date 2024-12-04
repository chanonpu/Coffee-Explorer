import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  ToastAndroid,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addItem } from '../components/store';
import Collapsible from 'react-native-collapsible';
import axios from 'axios';

const DetailsScreen = ({ route, navigation, name }) => {
  const { coffee } = route.params; // Access passed data
  const [isGrindCollapsed, setIsGrindCollapsed] = useState(true); // For Grind Option collapse
  const [selectedGrind, setSelectedGrind] = useState(coffee.grind_option[0]); // Default grind selection
  const [quantity, setQuantity] = useState(1); // Default quantity
  const dispatch = useDispatch();
  const [wishlistModalVisible, setWishlistModalVisible] = useState(false);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false); //check if in wishlist
  const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL;

  // Roast level mapping from numeric value to string
  const roastLevelMapping = {
    1: 'Light',
    2: 'Light-Medium',
    3: 'Medium',
    4: 'Medium-Dark',
    5: 'Dark',
  };

  // Fetch roast levels and grind options from the coffee data (assuming API sends them)
  const roastLevel = roastLevelMapping[coffee.roast_level] || 'Medium'; // set default to medium if api not provided
  const grindOptions = coffee.grind_option || [
    'Whole Bean',
    'Filtered',
    'Espresso',
  ]; // set default value if api not provided

  useEffect(() => {
    // Set default grind selection based on API data
    if (coffee.grind_options && coffee.grind_options.length > 0) {
      setSelectedGrind(coffee.grind_options[0]); // Set default grind
    }
  }, [coffee]);

  // fetch user wishlist if there is name
  useEffect(() => {
    const fetchWishlistData = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/wishlist`, {
          params: { username: name },
        });
        setIsInWishlist(response.data.some((item) => item.id === coffee.id));
      } catch (error) {
        console.error('Error:', error.response.data.error);
      }
    };

    if (name) fetchWishlistData();
  }, [coffee.id, name]);

  // add to cart method
  const handleAddToCart = () => {
    dispatch(
      addItem({
        id: coffee.id,
        name: coffee.name,
        image: coffee.image_url,
        price: coffee.price,
        quantity,
      })
    );
    setCartModalVisible(true);
  };

  // toggle wishlist method
  const handleWishlistToggle = async () => {
    if (!name) {
      setWishlistModalVisible(true);
    } else {
      try {
        const action = isInWishlist ? 'remove' : 'add';
        const response = await axios.post(`${SERVER_URL}/wishlist`, {
          coffeeId: coffee.id,
          username: name,
          action: action,
        });

        if (response.status === 200) {
          setIsInWishlist(!isInWishlist);
          ToastAndroid.show(
            isInWishlist ? 'Removed from wishlist!' : 'Added to wishlist!',
            ToastAndroid.SHORT
          );
        } else {
          const errorData = await response.json();
          console.err(errorData);
        }
      } catch (error) {
        console.error('Error updating wishlist:', error);
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: coffee.image_url }} style={styles.image} />
      <Text style={styles.name}>{coffee.name}</Text>

      {/* Display the coffee description */}
      <Text style={styles.description}>{coffee.description}</Text>
      <Text style={styles.price}>Origin: {coffee.region}</Text>
      <Text style={styles.price}>
        Flavor: {coffee.flavor_profile.join(', ')}
      </Text>

      {/* Display the price */}
      <Text style={styles.price}>Price: ${coffee.price.toFixed(2)}</Text>

      {/* Display the roast level */}
      <Text style={styles.label}>Roast Level: {roastLevel}</Text>

      {/* Collapsible section for grind option */}
      <TouchableOpacity
        onPress={() => setIsGrindCollapsed(!isGrindCollapsed)}
        style={styles.collapsibleHeader}>
        <Text style={styles.collapsibleText}>
          Select Grind: {selectedGrind}
        </Text>
      </TouchableOpacity>
      <Collapsible collapsed={isGrindCollapsed}>
        <View style={styles.collapsibleContent}>
          {grindOptions.map((grind, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedGrind(grind)}
              style={styles.optionItem}>
              <Text style={styles.optionText}>{grind}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Collapsible>

      {/* Quantity Buttons */}
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityLabel}>Quantity:</Text>
        <TouchableOpacity
          onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
          style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity
          onPress={() => setQuantity(quantity + 1)}
          style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Toggle wishlist Button */}
      <TouchableOpacity onPress={handleWishlistToggle} style={styles.addButton}>
        <Text style={styles.addButtonText}>
          {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </Text>
      </TouchableOpacity>

      {/* Add to Cart Button */}
      <TouchableOpacity onPress={handleAddToCart} style={styles.addButton}>
        <Text style={styles.addButtonText}>
          Add to Cart - ${(coffee.price * quantity).toFixed(2)}
        </Text>
      </TouchableOpacity>

      {/* Add to Cart Modal */}
      <Modal visible={cartModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              {quantity} x {coffee.name} added to cart!
            </Text>
            <View
              style={styles.modalButton}
              onStartShouldSetResponder={() => true}
              onResponderRelease={() => setCartModalVisible(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Wishlist Modal */}
      <Modal
        visible={wishlistModalVisible}
        transparent={true}
        animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Please sign in!</Text>
            <View
              style={styles.modalButton}
              onStartShouldSetResponder={() => true}
              onResponderRelease={() => setWishlistModalVisible(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f3ebe1',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 15,
  },
  name: {
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4b382a',
  },
  price: {
    fontSize: 18,
    color: '#6e4f2f',
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    fontSize: 18,
    color: '#6e4f2f',
    marginBottom: 20,
  },
  collapsibleHeader: {
    padding: 10,
    backgroundColor: '#e5d5c5',
    borderRadius: 5,
    marginBottom: 10,
  },
  collapsibleText: {
    fontSize: 16,
    color: '#4a2c13',
  },
  collapsibleContent: {
    backgroundColor: '#f7e7d5',
    padding: 10,
    borderRadius: 5,
  },
  optionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    marginRight: 20,
  },
  addButton: {
    backgroundColor: '#8B4513',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  quantityButton: {
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 40, // Makes the button circular
    width: 40, // Fixed width and height to make it circular
    height: 40, // Fixed width and height to make it circular
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 10,
    color: '#333',
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 18,
    color: '#333',
    marginHorizontal: 20, // Adds space between quantity and buttons
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

export default DetailsScreen;
