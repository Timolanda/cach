import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar, Card, Button, Overlay } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

const MarketplaceScreen = () => {
  const [search, setSearch] = useState('');
  const [assets, setAssets] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterVerification, setFilterVerification] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await api.get('/assets');
      setAssets(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load assets');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filteredAssets = [...assets];

    if (filterType) {
      filteredAssets = filteredAssets.filter(asset => asset.type === filterType);
    }

    if (filterVerification) {
      filteredAssets = filteredAssets.filter(asset => asset.verificationLevel === filterVerification);
    }

    if (sortBy === 'priceAsc') {
      filteredAssets.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      filteredAssets.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'changeAsc') {
      filteredAssets.sort((a, b) => a.change - b.change);
    } else if (sortBy === 'changeDesc') {
      filteredAssets.sort((a, b) => b.change - a.change);
    }

    setAssets(filteredAssets);
    setShowFilters(false);
  };

  const renderAssetItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('AssetDetails', { assetId: item.id })}>
      <Card containerStyle={styles.assetCard}>
        <View style={styles.assetHeader}>
          <Text style={styles.assetName}>{item.name}</Text>
          <Text style={styles.assetPrice}>${item.price.toFixed(2)}</Text>
        </View>
        <Text style={[styles.assetChange, { color: item.change >= 0 ? 'green' : 'red' }]}>
          {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
        </Text>
        <Text style={styles.assetType}>{item.type}</Text>
        <Text style={styles.verificationLevel}>{item.verificationLevel}</Text>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder="Search assets..."
        onChangeText={setSearch}
        value={search}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInputContainer}
      />
      <Button
        title="Filters & Sort"
        onPress={() => setShowFilters(true)}
        buttonStyle={styles.filterButton}
      />
      <FlatList
        data={assets}
        renderItem={renderAssetItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.assetList}
      />
      <Overlay isVisible={showFilters} onBackdropPress={() => setShowFilters(false)}>
        <View style={styles.filterOverlay}>
          <Text style={styles.filterTitle}>Filters & Sort</Text>
          <Picker
            selectedValue={filterType}
            onValueChange={(itemValue) => setFilterType(itemValue)}
          >
            <Picker.Item label="All Types" value="" />
            <Picker.Item label="Business" value="Business" />
            <Picker.Item label="Music" value="Music" />
            <Picker.Item label="Social Media" value="Social Media" />
          </Picker>
          <Picker
            selectedValue={filterVerification}
            onValueChange={(itemValue) => setFilterVerification(itemValue)}
          >
            <Picker.Item label="All Verification Levels" value="" />
            <Picker.Item label="No Stake" value="No Stake" />
            <Picker.Item label="20% Stake" value="20% Stake" />
            <Picker.Item label="Fully Audited" value="Fully Audited" />
          </Picker>
          <Picker
            selectedValue={sortBy}
            onValueChange={(itemValue) => setSortBy(itemValue)}
          >
            <Picker.Item label="Sort By" value="" />
            <Picker.Item label="Price (Low to High)" value="priceAsc" />
            <Picker.Item label="Price (High to Low)" value="priceDesc" />
            <Picker.Item label="Change (Low to High)" value="changeAsc" />
            <Picker.Item label="Change (High to Low)" value="changeDesc" />
          </Picker>
          <Button
            title="Apply Filters"
            onPress={applyFilters}
            buttonStyle={styles.applyFiltersButton}
          />
        </View>
      </Overlay>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    paddingHorizontal: 10,
  },
  searchBarInputContainer: {
    backgroundColor: '#e0e0e0',
  },
  filterButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 5,
    margin: 10,
  },
  assetList: {
    paddingHorizontal: 10,
  },
  assetCard: {
    borderRadius: 10,
    marginBottom: 10,
  },
  assetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  assetName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  assetPrice: {
    fontSize: 16,
  },
  assetChange: {
    fontSize: 14,
    marginBottom: 5,
  },
  assetType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  verificationLevel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  filterOverlay: {
    width: 300,
    padding: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  applyFiltersButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 5,
    marginTop: 20,
  },
});

export default MarketplaceScreen;

