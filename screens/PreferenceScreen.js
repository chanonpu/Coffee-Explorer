import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Collapsible from 'react-native-collapsible';

const PreferenceScreen = ({ navigation }) => {
  const [coffeeData, setCoffeeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [region, setRegion] = useState('');
  const [flavorProfile, setFlavorProfile] = useState('');
  const [roastLevel, setRoastLevel] = useState('');
  const [isRegionCollapsed, setIsRegionCollapsed] = useState(true);
  const [isFlavorCollapsed, setIsFlavorCollapsed] = useState(true);
  const [isRoastCollapsed, setIsRoastCollapsed] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  

  // Fetch coffee data
  useEffect(() => {
    fetch('https://fake-coffee-api.vercel.app/api')
      .then((response) => response.json())
      .then((data) => setCoffeeData(data))
      .catch((error) => console.error('Error fetching coffee data:', error));
  }, []);

  // Filter coffee data based on preferences
  useEffect(() => {
    let filtered = coffeeData;

    if (region)
      filtered = filtered.filter((coffee) => coffee.region === region);
    if (flavorProfile)
      filtered = filtered.filter((coffee) =>
        coffee.flavor_profile.includes(flavorProfile)
      );
    if (roastLevel)
      filtered = filtered.filter(
        (coffee) => coffee.roast_level === parseInt(roastLevel)
      );

    setFilteredData(filtered);
  }, [region, flavorProfile, roastLevel, coffeeData]);

  const renderCoffeeItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Details', { coffee: item })}
      style={styles.card}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  // Reset all filters
  const resetFilters = () => {
    setRegion('');
    setFlavorProfile('');
    setRoastLevel('');
    setIsRegionCollapsed(true);
    setIsFlavorCollapsed(true);
    setIsRoastCollapsed(true);
  };

  // Toggle filter visibility
  const showFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover Your Perfect Coffee</Text>

      {/* Collapsible Filters */}
      {isFiltersVisible && (
        <>
          {/* Region Filter */}
          <TouchableOpacity
            onPress={() => setIsRegionCollapsed(!isRegionCollapsed)}
            style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Region</Text>
          </TouchableOpacity>
          <Collapsible collapsed={isRegionCollapsed}>
            {['Central America', 'Africa', 'South America', 'Asia Pacific'].map(
              (item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setRegion(item)}
                  style={styles.filterOption}>
                  <Text
                    style={
                      region === item ? styles.selectedOption : styles.option
                    }>
                    {item}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </Collapsible>

          {/* Flavor Profile Filter */}
          <TouchableOpacity
            onPress={() => setIsFlavorCollapsed(!isFlavorCollapsed)}
            style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Flavor Profile</Text>
          </TouchableOpacity>
          <Collapsible collapsed={isFlavorCollapsed}>
            {['Dark Chocolate', 'Citrus', 'Hazelnut', 'Nutty'].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setFlavorProfile(item)}
                style={styles.filterOption}>
                <Text
                  style={
                    flavorProfile === item
                      ? styles.selectedOption
                      : styles.option
                  }>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </Collapsible>

          {/* Roast Level Filter */}
          <TouchableOpacity
            onPress={() => setIsRoastCollapsed(!isRoastCollapsed)}
            style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Roast Level</Text>
          </TouchableOpacity>
          <Collapsible collapsed={isRoastCollapsed}>
            {['Light', 'Medium Light', 'Medium', 'Medium Dark', 'Dark'].map(
              (item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setRoastLevel((index + 1).toString())}
                  style={styles.filterOption}>
                  <Text
                    style={
                      roastLevel === (index + 1).toString()
                        ? styles.selectedOption
                        : styles.option
                    }>
                    {item}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </Collapsible>

          {/* Reset Filters Button */}
          <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Show Filters Button */}
      <TouchableOpacity onPress={showFilters} style={styles.resetButton}>
        <Text style={styles.resetButtonText}>Filters</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCoffeeItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.noResults}>
            No coffee matches your preferences.
          </Text>
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
  filterHeader: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5B3A29',
  },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  option: {
    fontSize: 16,
    color: '#333',
  },
  selectedOption: {
    fontSize: 16,
    color: '#8B572A',
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#8B572A',
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 5,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
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

export default PreferenceScreen;
