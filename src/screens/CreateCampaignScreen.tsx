import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Button, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

const CreateCampaignScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleCreateCampaign = async () => {
    try {
      await api.post('/campaigns', {
        name,
        description,
        goal: parseFloat(goal),
        duration: parseInt(duration),
      });
      navigation.navigate('Crowdfunding');
    } catch (err) {
      setError('Failed to create campaign. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text h3 style={styles.title}>Create a New Campaign</Text>
        <Input
          placeholder="Campaign Name"
          value={name}
          onChangeText={setName}
        />
        <Input
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Input
          placeholder="Funding Goal ($)"
          value={goal}
          onChangeText={setGoal}
          keyboardType="numeric"
        />
        <Input
          placeholder="Duration (days)"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          title="Create Campaign"
          onPress={handleCreateCampaign}
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

export default CreateCampaignScreen;

