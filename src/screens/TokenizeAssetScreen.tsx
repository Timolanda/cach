import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Button, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

const TokenizeAssetScreen = () => {
  const [assetName, setAssetName] = useState('');
  const [assetDescription, setAssetDescription] = useState('');
  const [assetType, setAssetType] = useState('');
  const [totalShares, setTotalShares] = useState('');
  const [initialSharePrice, setInitialSharePrice] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleTokenize = async () => {
    try {
      await api.post('/assets/tokenize', {
        name: assetName,
        description: assetDescription,
        type: assetType,
        totalShares: parseInt(totalShares),
        initialSharePrice: parseFloat(initialSharePrice),
      });
      navigation.navigate('Marketplace');
    } catch (err) {
      setError('Failed to tokenize asset. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text h3 style={styles.title}>Tokenize Your Asset</Text>
        <Input
          placeholder="Asset Name"
          value={assetName}
          onChangeText={setAssetName}
        />
        <Input
          placeholder="Asset Description"
          value={assetDescription}
          onChangeText={setAssetDescription}
          multiline
        />
        <Input
          placeholder="Asset Type (e.g., Business, Idea, Music Album)"
          value={assetType}
          onChangeText={setAssetType}
        />
        <Input
          placeholder="Total Shares"
          value={totalShares}
          onChangeText={setTotalShares}
          keyboardType="numeric"
        />
        <Input
          placeholder="Initial Share Price ($)"
          value={initialSharePrice}
          onChangeText={setInitialSharePrice}
          keyboardType="numeric"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          title="Tokenize Asset"
          onPress={handleTokenize}
          buttonStyle={styles.button}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4a90e2',
    borderRadius: 5,
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default TokenizeAssetScreen;

