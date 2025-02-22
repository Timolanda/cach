import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, ProgressBar, Input } from 'react-native-elements';
import { useRoute } from '@react-navigation/native';
import api from '../services/api';

const CampaignDetailsScreen = () => {
  const route = useRoute();
  const { campaignId } = route.params;
  const [campaign, setCampaign] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCampaignDetails();
  }, []);

  const fetchCampaignDetails = async () => {
    try {
      const response = await api.get(`/campaigns/${campaignId}`);
      setCampaign(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load campaign details');
      setLoading(false);
    }
  };

  const handleInvest = async () => {
    try {
      await api.post(`/campaigns/${campaignId}/invest`, { amount: parseFloat(investmentAmount) });
      fetchCampaignDetails(); // Refresh campaign details
      setInvestmentAmount('');
    } catch (err) {
      setError('Investment failed. Please try again.');
    }
  };

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
      <ScrollView>
        <Card containerStyle={styles.card}>
          <Card.Title>{campaign.name}</Card.Title>
          <Text style={styles.description}>{campaign.description}</Text>
          <Text style={styles.goalText}>Goal: ${campaign.goal.toLocaleString()}</Text>
          <Text style={styles.raisedText}>Raised: ${campaign.raised.toLocaleString()}</Text>
          <ProgressBar
            value={campaign.raised / campaign.goal}
            color="#4a90e2"
            style={styles.progressBar}
          />
          <Text style={styles.daysLeftText}>{campaign.daysLeft} days left</Text>
        </Card>

        <Card containerStyle={styles.card}>
          <Card.Title>Invest in this Campaign</Card.Title>
          <Input
            placeholder="Investment Amount"
            value={investmentAmount}
            onChangeText={setInvestmentAmount}
            keyboardType="numeric"
          />
          <Button
            title="Invest"
            onPress={handleInvest}
            buttonStyle={styles.investButton}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    borderRadius: 10,
    marginBottom: 15,
  },
  description: {
    marginBottom: 10,
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
  investButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginTop: 10,
  },
});

export default CampaignDetailsScreen;

