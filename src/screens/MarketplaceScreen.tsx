import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from 'react-native-elements';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchMarketplaceAssets } from '@/store/slices/marketplaceSlice';
import { useTheme } from '@/context/ThemeContext';
import AssetCard from '@/components/AssetCard';
import LoadingScreen from '@/components/LoadingScreen';

const MarketplaceScreen = () => {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { assets, loading } = useAppSelector((state) => state.marketplace);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    await dispatch(fetchMarketplaceAssets());
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAssets();
    setRefreshing(false);
  };

  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !refreshing) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
      <SearchBar
        placeholder="Search assets..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        platform="ios"
        containerStyle={[
          styles.searchContainer,
          { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }
        ]}
        inputContainerStyle={[
          styles.searchInputContainer,
          { backgroundColor: isDark ? '#2a2a2a' : '#ffffff' }
        ]}
        inputStyle={{ color: isDark ? '#ffffff' : '#000000' }}
      />
      <FlatList
        data={filteredAssets}
        renderItem={({ item }) => <AssetCard asset={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={isDark ? '#ffffff' : '#000000'}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchInputContainer: {
    borderRadius: 12,
  },
  listContainer: {
    paddingBottom: 16,
  },
});

export default MarketplaceScreen;

