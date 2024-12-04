import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { resetState } from '../components/store';

const CheckoutScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDetails, setModalDetails] = useState({});
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const handleConfirm = () => {
    if (!name || !addressLine1 || !city || !province || !postalCode) {
      setModalDetails({ message: 'Please fill in all required fields.' });
      setModalVisible(true);
      return;
    }

    // Set order details
    setModalDetails({
      name,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      province,
      postalCode,
      deliveryInstructions,
      paymentMethod,
    });

    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Checkout</Text>

      {/* Name */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Phone Number */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Phone Number (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      {/* Address Line 1 */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Address Line 1</Text>
        <TextInput
          style={styles.input}
          placeholder="Street address, P.O. box"
          value={addressLine1}
          onChangeText={setAddressLine1}
        />
      </View>

      {/* Address Line 2 */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Address Line 2 (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Apartment, suite, unit, building, floor, etc."
          value={addressLine2}
          onChangeText={setAddressLine2}
        />
      </View>

      {/* City */}
      <View style={styles.formSection}>
        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your city"
          value={city}
          onChangeText={setCity}
        />
      </View>

      {/* Province */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Province</Text>
        <TextInput
          style={styles.input}
          defaultValue="ON"
          placeholder="Enter your province"
          value={province}
          onChangeText={setProvince}
        />
      </View>

      {/* Postal Code */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Postal Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your postal code"
          value={postalCode}
          onChangeText={setPostalCode}
        />
      </View>

      {/* Delivery Instructions */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Delivery Instructions (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Any special instructions for delivery"
          value={deliveryInstructions}
          onChangeText={setDeliveryInstructions}
          multiline
        />
      </View>

      {/* Payment Method */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Payment Method</Text>

        <View style={styles.radioGroup}>
          {['Credit Card', 'Debit Card', 'PayPal'].map((method) => (
            <TouchableOpacity
              key={method}
              style={styles.radioContainer}
              onPress={() => setPaymentMethod(method)}>
              <View
                style={[
                  styles.radioCircle,
                  paymentMethod === method && styles.selectedRadio,
                ]}>
                {paymentMethod === method && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioLabel}>{method}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirm Order</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back to Cart</Text>
      </TouchableOpacity>

      {/* Modal Field */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Order Details</Text>

            {modalDetails.message ? (
              <>
                <Text style={styles.modalText}>{modalDetails.message}</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalText}>Name: {modalDetails.name}</Text>
                <Text style={styles.modalText}>
                  Phone: {modalDetails.phoneNumber || 'N/A'}
                </Text>
                <Text style={styles.modalText}>
                  Address: {modalDetails.addressLine1},{' '}
                  {modalDetails.addressLine2 || ''}
                </Text>
                <Text style={styles.modalText}>
                  {modalDetails.city}, {modalDetails.province}{' '}
                  {modalDetails.postalCode}
                </Text>
                <Text style={styles.modalText}>
                  Payment Method: {modalDetails.paymentMethod}
                </Text>
                <Text style={styles.modalText}>
                  Delivery Instructions:{' '}
                  {modalDetails.deliveryInstructions || 'None'}
                </Text>

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    // Reset cart and navigate
                    dispatch(resetState());
                    navigation.navigate('Home');
                    Alert.alert("Thank you for your order");
                    setModalVisible(false);
                  }}>
                  <Text style={styles.modalButtonText}>Confirm Order</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3ebe1',
    padding: 20,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#7B3F00',
    textAlign: 'center',
    marginBottom: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#4b382a',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#4b382a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  confirmButton: {
    backgroundColor: '#7B3F00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 15,
  },
  backButton: {
    backgroundColor: '#7B3F00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4b382a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  selectedRadio: {
    backgroundColor: '#4b382a',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4b382a',
  },
  radioLabel: {
    fontSize: 16,
    color: '#4b382a',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4b382a',
    marginBottom: 15,
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

export default CheckoutScreen;
