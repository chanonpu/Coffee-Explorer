import React, { useState } from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

// import Screen
import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';
import DetailsScreen from './screens/DetailsScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import UserScreen from './screens/UserScreen';
import FAQScreen from './screens/FAQScreen';
import RegisterScreen from './screens/RegisterScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import WishlistScreen from './screens/WishlistScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Set Up the Drawer Toggle
const CustomDrawerButton = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
      <Image
        source={require('./assets/logo.png')} // Drawer Icon path
        style={{ width: 50, height: 50 }} // Icon size
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

// Set up option for the drawer
const drawerScreenOptions = ({ navigation }) => ({
  headerTitle: 'Coffee Explorer', //title name
  headerLeft: () => <CustomDrawerButton navigation={navigation} />, // Adds a custom drawer button
  headerStyle: {
    backgroundColor: '#f3ebe1', //change background color
  },
  headerTintColor: '#4b382a', //change text color
});

// function to make detailsScreen stack
const createStackNavigatorWithDetails = (
  initialScreenName,
  initialScreenComponent,
  name
) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={initialScreenName}
        component={initialScreenComponent}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        children={(props) => <DetailsScreen {...props} name={name} />}
        options={{
          title: 'Coffee Details',
          headerStyle: {
            backgroundColor: '#7B3F00',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
};

// Make details screen in explore screen
const ExploreStackNavigator = ({ name }) =>
  createStackNavigatorWithDetails('Explore', ExploreScreen, name);

// Make details screen in wishlist screen
const WishlistStackNavigator = ({ name }) =>
  createStackNavigatorWithDetails('WishlistTab', () => <WishlistScreen name={name} />, name);

// Make details screen in home screen
const HomeStackNavigator = ({ name }) =>
  createStackNavigatorWithDetails('Home', () => <HomeScreen name={name} />, name);

// Make CheckoutScreen in CartScreen
const CartStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Cart"
      component={CartScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const MainTabs = ({ name }) => {
  const cartItems = useSelector((state) => state.cart.items); // Access cart items from the store
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0); // Calculate total quantity of items in the cart

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#f9f5f0', // Set background color of the tab bar
        },
        tabBarActiveTintColor: '#7B3F00', // Active icon color
        // tabBarInactiveTintColor: '#FFFFFF', // Inactive icon colorz
      }}>
      <Tab.Screen
        name="HomeTab"
        children={() => <HomeStackNavigator name={name} />}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ExploreTab"
        children={() => <ExploreStackNavigator name={name} />}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStackNavigator}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <View style={{ position: 'relative' }}>
              <Ionicons name="cart" color={color} size={size} />
              {totalItems > 0 && ( // Only show badge if there are items in the cart
                <Text
                  style={{
                    position: 'absolute',
                    right: -10,
                    top: -5,
                    backgroundColor: 'red',
                    borderRadius: 10,
                    color: 'white',
                    paddingHorizontal: 5,
                    fontSize: 12,
                  }}>
                  {totalItems}
                </Text>
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Show this if logined
const AuthenticatedDrawer = ({ setIsLoggedIn, setName, name }) => (
  <Drawer.Navigator screenOptions={drawerScreenOptions}>
    <Drawer.Screen name="MainTabs" children={() => <MainTabs name={name} />} />
    <Drawer.Screen name="User">
      {(props) => (
        <UserScreen {...props} setIsLoggedIn={setIsLoggedIn} setName={setName} name={name} />
      )}
    </Drawer.Screen>
    <Drawer.Screen name="Wishlist" children={() => <WishlistStackNavigator name={name} />} />
    <Drawer.Screen name="FAQ" component={FAQScreen} />
  </Drawer.Navigator>
);

// Show this if not login
const UnauthenticatedDrawer = ({ setIsLoggedIn, setName }) => (
  <Drawer.Navigator screenOptions={drawerScreenOptions}>
    <Drawer.Screen name="MainTabs" component={MainTabs} />
    <Drawer.Screen name="Login">
      {(props) => (
        <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} setName={setName} />
      )}
    </Drawer.Screen>
    <Drawer.Screen name="Register" component={RegisterScreen} />
    <Drawer.Screen name="FAQ" component={FAQScreen} />
  </Drawer.Navigator>
);

export default function MainNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState();

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <AuthenticatedDrawer setIsLoggedIn={setIsLoggedIn} setName={setName} name={name} />
      ) : (
        <UnauthenticatedDrawer setIsLoggedIn={setIsLoggedIn} setName={setName} />
      )}
    </NavigationContainer>
  );
}
