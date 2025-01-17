import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, ListItem, Text } from 'react-native-elements';
import api from '../services/api';
import ErrorHandler from '../components/ErrorHandler';
import AccessibleButton from '../components/AccessibleButton';
import DepositModal from '../components/DepositModal';
import WithdrawModal from '../components/WithdrawModal';

const WalletScreen = () => {
  const [balance, setBalance] = useState(0);
  const [assets, setAssets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const fetchWalletData = async () => {
    try {
      const balanceResponse = await api.get('/wallet/balance');
      setBalance(balanceResponse.data.balance);

      const assetsResponse = await api.get('/wallet/assets');
      setAssets(assetsResponse.data);

      setError('');
    } catch (err) {
      setError('Failed to fetch wallet data');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWalletData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleDeposit = async (amount) => {
    try {
      await api.post('/wallet/deposit', { amount });
      await fetchWalletData();
      setShowDepositModal(false);
    } catch (err) {
      setError('Failed to process deposit');
    }
  };

  const handleWithdraw = async (amount) => {
    try {
      await api.post('/wallet/withdraw', { amount });
      await fetchWalletData();
      setShowWithdrawModal(false);
    } catch (err) {
      setError('Failed to process withdrawal');
    }
  };

  if (error) {
    return <ErrorHandler error={error} onRetry={fetchWalletData} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card containerStyle={styles.balanceCard}>
          <Card.Title>Total Balance</Card.Title>
          <Card.FeaturedSubtitle style={styles.balanceAmount}>
            ${balance.toFixed(2)}
          </Card.FeaturedSubtitle>
          <View style={styles.buttonContainer}>
            <AccessibleButton
              title="Deposit"
              onPress={() => setShowDepositModal(true)}
              buttonStyle={[styles.button, styles.depositButton]}
              accessibilityLabel="Deposit funds"
            />
            <AccessibleButton
              title="Withdraw"
              onPress={() => setShowWithdrawModal(true)}
              buttonStyle={[styles.button, styles.withdrawButton]}
              accessibilityLabel="Withdraw funds"
            />
          </View>
        </Card>

        <Card containerStyle={styles.assetsCard}>
          <Card.Title>Your Assets</Card.Title>
          {assets.map((asset, index) => (
            <ListItem key={index} bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{asset.name}</ListItem.Title>
                <ListItem.Subtitle>{asset.amount} shares</ListItem.Subtitle>
              </ListItem.Content>
              <Text>${asset.value.toFixed(2)}</Text>
            </ListItem>
          ))}
        </Card>
      </ScrollView>

      <DepositModal
        isVisible={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onDeposit={handleDeposit}
      />

      <WithdrawModal
        isVisible={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onWithdraw={handleWithdraw}
        maxAmount={balance}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  balanceCard: {
    borderRadius: 10,
    marginBottom: 20,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 5,
    paddingHorizontal: 30,
  },
  depositButton: {
    backgroundColor: '#4CAF50',
  },
  withdrawButton: {
    backgroundColor: '#F44336',
  },
  assetsCard: {
    borderRadius: 10,
  },
});

export default WalletScreen;

