import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-elements';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { connectWallet } from '@/store/slices/walletSlice';
import { useTheme } from '@/context/ThemeContext';
import WalletCard from '@/components/WalletCard';
import TransactionList from '@/components/TransactionList';
import LoadingScreen from '@/components/LoadingScreen';
import * as Clipboard from 'expo-clipboard';

const WalletScreen = () => {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { address, balance, transactions, loading } = useAppSelector((state) => state.wallet);

  useEffect(() => {
    if (!address) {
      handleConnectWallet();
    }
  }, []);

  const handleConnectWallet = async () => {
    await dispatch(connectWallet());
  };

  const handleCopyAddress = async () => {
    if (address) {
      await Clipboard.setStringAsync(address);
      // You might want to show a toast message here
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
      <ScrollView>
        {address ? (
          <>
            <WalletCard
              address={address}
              balance={balance}
              onCopyAddress={handleCopyAddress}
            />
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
                Recent Transactions
              </Text>
              <TransactionList
                transactions={transactions}
                userAddress={address}
                onTransactionPress={(tx) => {
                  // Handle transaction press
                  console.log('Transaction pressed:', tx);
                }}
              />
            </View>
          </>
        ) : (
          <View style={styles.connectContainer}>
            <Text style={[styles.connectText, { color: isDark ? '#ffffff' : '#000000' }]}>
              Connect your wallet to start managing your assets
            </Text>
            <Button
              title="Connect Wallet"
              onPress={handleConnectWallet}
              buttonStyle={[styles.connectButton, { backgroundColor: isDark ? '#007AFF' : '#0A84FF' }]}
              titleStyle={styles.connectButtonText}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  connectContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: '50%',
  },
  connectText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  connectButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WalletScreen;

