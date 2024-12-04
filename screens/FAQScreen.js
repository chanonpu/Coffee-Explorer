import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { MaterialIcons } from 'react-native-vector-icons';  // Import the icon library

const FAQScreen = () => {
  const [isRoastCollapsed, setIsRoastCollapsed] = useState(true);
  const [isGrindCollapsed, setIsGrindCollapsed] = useState(true);
  const [isRegionCollapsed, setIsRegionCollapsed] = useState(true);
  const [isFlavorCollapsed, setIsFlavorCollapsed] = useState(true);

  // Roast Levels Data
  const roastLevels = [
    {
      name: 'Light Roast (Level 1)',
      description: 'Known for preserving the most natural flavors of the beans, light roasts often offer bright, tangy acidity. Expect fruity or floral notes.',
      example: 'Example Coffee: Himalayan Heights – A delicate floral and citrusy blend with a honeyed finish, grown in the Himalayan mountains.',
    },
    {
      name: 'Medium Roast (Level 2-3)',
      description: 'Balances acidity and body, perfect for those who enjoy complex flavors. Medium roasts tend to showcase sweetness and can have both fruity and nutty flavors.',
      example: 'Example Coffee: Golden Sunrise – A bright and citrusy coffee, perfect for a fresh start to the day with notes of lemon and grapefruit.',
    },
    {
      name: 'Dark Roast (Level 4-5)',
      description: 'Bold, smoky, and full-bodied. Dark roasts tend to have deep, rich flavors with chocolatey or caramel notes.',
      example: 'Example Coffee: Wildfire – A smoky, bold blend with notes of dark chocolate and molasses, ideal for an intense coffee experience.',
    },
  ];

  // Grind Options Data
  const grindOptions = [
    {
      name: 'Whole Bean',
      description: 'Whole beans for the freshest grind at home..'
    },
    {
      name: 'Cafetiere',
      description: 'Coarse grind for a smooth, full-bodied brew.'
    },
    {
      name: 'Filter',
      description: 'Medium grind for drip coffee makers.'
    },
    {
      name: 'Espresso',
      description: 'Fine grind for that perfect shot.'
    }
  ];

  // Region Data
  const regions = [
    {
      name: 'Central America',
      description: 'Smooth, nutty, and chocolatey flavors with balanced acidity. Ideal for a comforting cup.',
      example: 'Example Coffee: Signature Blend – Rich with dark chocolate and black cherry notes, sourced from misty mountain slopes.',
    },
    {
      name: 'Africa',
      description: 'Known for vibrant, fruity coffees with a wide range of complex flavors, including citrus and berry notes.',
      example: 'Example Coffee: Ethiopian Yirgacheffe – A light, fruity coffee with notes of blueberry and citrus, perfect for a refreshing morning.',
    },
    {
      name: 'South America',
      description: 'Full-bodied and nutty with a hint of caramel and chocolate. Perfect for those who enjoy balanced, rich flavors.',
      example: 'Example Coffee: Rainforest Rhapsody – An earthy coffee with toasted nuts and caramel notes, sustainably grown in the rainforests.',
    },
    {
      name: 'Asia Pacific',
      description: 'Earthy, spicy flavors, with some coffees having a robust body and a smoky finish.',
      example: 'Example Coffee: Indo-Viet Roast – A spicy, earthy blend with notes of cinnamon and clove, perfect for drip or French press brewing.',
    },
    {
      name: 'Middle East',
      description: 'Exotic and spiced, often with hints of cardamom, cinnamon, and bold, rich flavors.',
      example: 'Example Coffee: Arabian Nights – A bold, spicy coffee with cardamom and cinnamon, ideal for those who love a little extra kick.',
    },
  ];

  // Flavor Profile Data
  const flavorProfiles = [
    {
      name: 'Citrus',
      description: 'Bright and tangy, often found in coffees from Africa and some parts of Central America. Think lemon, lime, or grapefruit.',
      example: 'Example Coffee: Golden Sunrise – A citrusy kick, sourced from the rolling hills of Africa.',
    },
    {
      name: 'Chocolate',
      description: 'Rich, deep, and sweet flavors often found in Central American and South American coffees.',
      example: 'Example Coffee: Lazy Days – A smooth coffee with hints of hazelnut, chocolate, and caramel from Brazil.',
    },
    {
      name: 'Nutty',
      description: 'Smooth and comforting, nutty coffees are often low in acidity and come with caramel or toffee undertones.',
      example: 'Example Coffee: Walnut Wonder – A nutty, smooth coffee from the slopes of South America.',
    },
    {
      name: 'Spicy',
      description: 'Earthy and bold with a bit of a kick, often found in coffees from the Asia Pacific and Middle East.',
      example: 'Example Coffee: Indo-Viet Roast – A spicy blend with cinnamon and clove, ideal for French press brewing.',
    },
    {
      name: 'Floral',
      description: 'Light and fragrant, floral notes can be found in lighter roasts, often with a honey-like sweetness.',
      example: 'Example Coffee: Himalayan Heights – A light roast with bright acidity and delicate floral notes, grown in the Himalayas.',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Roast Level Section */}
      <TouchableOpacity onPress={() => setIsRoastCollapsed(!isRoastCollapsed)} style={styles.header}>
        <MaterialIcons name="local-fire-department" size={30} color="#fff" style={styles.icon} />
        <Text style={styles.headerText}>Roast Levels</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isRoastCollapsed}>
        <View style={styles.content}>
          {roastLevels.map((level, index) => (
            <View key={index} style={styles.roastContainer}>
              <Text style={styles.label}>{level.name}</Text>
              <Text style={styles.description}>{level.description}</Text>
              <Text style={styles.example}>{level.example}</Text>
            </View>
          ))}
        </View>
      </Collapsible>

      {/* Grind Options Section */}
      <TouchableOpacity onPress={() => setIsGrindCollapsed(!isGrindCollapsed)} style={styles.header}>
        <MaterialIcons name="filter-alt" size={30} color="#fff" style={styles.icon} />
        <Text style={styles.headerText}>Grind Options</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isGrindCollapsed}>
        <View style={styles.content}>
          {grindOptions.map((option, index) => (
            <View key={index} style={styles.regionContainer}>
              <Text style={styles.label}>{option.name}</Text>
              <Text style={styles.description}>{option.description}</Text>
            </View>
          ))}
        </View>
      </Collapsible>

      {/* Region Section */}
      <TouchableOpacity onPress={() => setIsRegionCollapsed(!isRegionCollapsed)} style={styles.header}>
        <MaterialIcons name="location-on" size={30} color="#fff" style={styles.icon} />
        <Text style={styles.headerText}>Region</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isRegionCollapsed}>
        <View style={styles.content}>
          {regions.map((region, index) => (
            <View key={index} style={styles.regionContainer}>
              <Text style={styles.label}>{region.name}</Text>
              <Text style={styles.description}>{region.description}</Text>
              <Text style={styles.example}>{region.example}</Text>
            </View>
          ))}
        </View>
      </Collapsible>

      {/* Flavor Profile Section */}
      <TouchableOpacity onPress={() => setIsFlavorCollapsed(!isFlavorCollapsed)} style={styles.header}>
        <MaterialIcons name="emoji-food-beverage" size={30} color="#fff" style={styles.icon} />
        <Text style={styles.headerText}>Flavor Profile</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isFlavorCollapsed}>
        <View style={styles.content}>
          {flavorProfiles.map((flavor, index) => (
            <View key={index} style={styles.flavorContainer}>
              <Text style={styles.label}>{flavor.name}</Text>
              <Text style={styles.description}>{flavor.description}</Text>
              <Text style={styles.example}>{flavor.example}</Text>
            </View>
          ))}
        </View>
      </Collapsible>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3ebe1',
    padding: 20,
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
  icon: {
    marginRight: 10,
  },
  content: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },
  roastContainer: {
    marginBottom: 15,
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
  example: {
    fontSize: 12,
    color: '#7B3F00',
    fontStyle: 'italic',
  },
  regionContainer: {
    marginBottom: 15,
  },
  flavorContainer: {
    marginBottom: 15,
  },
});

export default FAQScreen;
