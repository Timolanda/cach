import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Card, Input } from 'react-native-elements';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../services/api';

const AssetDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { assetId } = route.params;
  const [asset, setAsset] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssetDetails();
  }, []);

  const fetchAssetDetails = async () => {
    try {
      const response = await api.get(`/assets/${assetId}`);
      setAsset(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load asset details');
      setLoading(false);
    }
  };

  const handleTrade = async (action) => {
    try {
      await api.post('/trades', { assetId, action, amount: parseFloat(amount) });
      navigation.goBack();
    } catch (err) {
      setError('Trade failed. Please try again.');
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
          <Card.Title>{asset.name}</Card.Title>
          <Text style={styles.price}>Current Price: ${asset.price.toFixed(2)}</Text>
          <Text style={styles.change}>
            24h Change: {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
          </Text>
          <Text style={styles.description}>{asset.description}</Text>
          <Text style={styles.info}>Type: {asset.type}</Text>
          <Text style={styles.info}>Verification Level: {asset.verificationLevel}</Text>
        </Card>

        <Card containerStyle={styles.card}>
          <Card.Title>Trade</Card.Title>
          <Input
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Buy"
              onPress={() => handleTrade('buy')}
              buttonStyle={[styles.button, styles.buyButton]}
            />
            <Button
              title="Sell"
              onPress={() => handleTrade('sell')}
              buttonStyle={[styles.button, styles.sellButton]}
            />
          </View>
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
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  change: {
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    marginBottom: 10,
  },
  info: {
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    width: '48%',
    borderRadius: 5,
  },
  buyButton: {
    backgroundColor: '#4CAF50',
  },
  sellButton: {
    backgroundColor: '#F44336',
  },
});

export default AssetDetailsScreen;

