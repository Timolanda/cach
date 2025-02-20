import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, ProgressBar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

const CrowdfundingScreen = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await api.get('/campaigns');
      setCampaigns(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load campaigns');
      setLoading(false);
    }
  };

  const renderCampaignItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('CampaignDetails', { campaignId: item.id })}>
      <Card containerStyle={styles.campaignCard}>
        <Card.Title>{item.name}</Card.Title>
        <Card.Divider />
        <Text style={styles.goalText}>Goal: ${item.goal.toLocaleString()}</Text>
        <Text style={styles.raisedText}>Raised: ${item.raised.toLocaleString()}</Text>
        <ProgressBar
          value={item.raised / item.goal}
          color="#4a90e2"
          style={styles.progressBar}
        />
        <Text style={styles.daysLeftText}>{item.daysLeft} days left</Text>
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
      <Text style={styles.title}>Active Crowdfunding Campaigns</Text>
      <FlatList
        data={campaigns}
        renderItem={renderCampaignItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.campaignList}
      />
      <Button
        title="Start Your Own Campaign"
        onPress={() => navigation.navigate('CreateCampaign')}
        buttonStyle={styles.createCampaignButton}
        containerStyle={styles.createCampaignButtonContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  campaignList: {
    paddingHorizontal: 10,
  },
  campaignCard: {
    borderRadius: 10,
    marginBottom: 15,
  },
  goalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  raisedText: {
    fontSize: 16,
    marginBottom: 10,
  },
  progressBar: {
    marginVertical: 10,
  },
  daysLeftText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  createCampaignButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  createCampaignButtonContainer: {
    margin: 20,
  },
});

export default CrowdfundingScreen;

