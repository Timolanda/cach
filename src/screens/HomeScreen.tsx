import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Welcome to Cach</Text>
        <Text style={styles.subtitle}>Tokenize Your Digital Assets</Text>

        <Card containerStyle={styles.card}>
          <Card.Title>Asset Tokenization</Card.Title>
          <Card.Divider />
          <Text style={styles.cardText}>
            Turn your business, idea, or digital asset into valuable tokens.
          </Text>
          <Button
            title="Tokenize Now"
            onPress={() => navigation.navigate('TokenizeAsset')}
            buttonStyle={styles.button}
          />
        </Card>

        <Card containerStyle={styles.card}>
          <Card.Title>Marketplace</Card.Title>
          <Card.Divider />
          <Text style={styles.cardText}>
            Buy, sell, and trade tokenized shares in our dynamic marketplace.
          </Text>
          <Button
            title="Explore Marketplace"
            onPress={() => navigation.navigate('Marketplace')}
            buttonStyle={styles.button}
          />
        </Card>

        <Card containerStyle={styles.card}>
          <Card.Title>Crowdfunding</Card.Title>
          <Card.Divider />
          <Text style={styles.cardText}>
            Participate in exciting crowdfunding campaigns and stake your tokens.
          </Text>
          <Button
            title="View Campaigns"
            onPress={() => navigation.navigate('Crowdfunding')}
            buttonStyle={styles.button}
          />
        </Card>

        <Card containerStyle={styles.card}>
          <Card.Title>Your Wallet</Card.Title>
          <Card.Divider />
          <Text style={styles.cardText}>
            Manage your assets, track your investments, and monitor your earnings.
          </Text>
          <Button
            title="Open Wallet"
            onPress={() => navigation.navigate('Wallet')}
            buttonStyle={styles.button}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  card: {
    borderRadius: 10,
    marginBottom: 15,
  },
  cardText: {
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4a90e2',
    borderRadius: 5,
  },
});

export default HomeScreen;

