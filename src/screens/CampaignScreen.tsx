import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar, FAB } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchCampaigns } from '@/store/slices/crowdfundingSlice';
import { useTheme } from '@/context/ThemeContext';
import CampaignCard from '@/components/CampaignCard';
import LoadingScreen from '@/components/LoadingScreen';

const CampaignScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { campaigns, loading } = useAppSelector((state) => state.crowdfunding);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    await dispatch(fetchCampaigns());
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCampaigns();
    setRefreshing(false);
  };

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !refreshing) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
      <SearchBar
        placeholder="Search campaigns..."
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
        data={filteredCampaigns}
        renderItem={({ item }) => <CampaignCard campaign={item} />}
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
      <FAB
        title="Create Campaign"
        placement="right"
        color={isDark ? '#007AFF' : '#0A84FF'}
        onPress={() => navigation.navigate('CreateCampaign')}
        containerStyle={styles.fabContainer}
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
    paddingBottom: 80,
  },
  fabContainer: {
    marginBottom: 16,
    marginRight: 16,
  },
});

export default CampaignScreen; 