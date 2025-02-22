import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/context/ThemeContext';

interface WalletCardProps {
  address: string;
  balance: string;
  onDisconnect?: () => void;
  onCopyAddress?: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({
  address,
  balance,
  onDisconnect,
  onCopyAddress,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#2a2a2a' : '#ffffff' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#000000' }]}>
          Wallet
        </Text>
        {onDisconnect && (
          <TouchableOpacity onPress={onDisconnect}>
            <Text style={styles.disconnect}>Disconnect</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.balanceContainer}>
        <Text style={[styles.balanceLabel, { color: isDark ? '#cccccc' : '#666666' }]}>
          Balance
        </Text>
        <Text style={[styles.balance, { color: isDark ? '#ffffff' : '#000000' }]}>
          ${balance}
        </Text>
      </View>
      <View style={styles.addressContainer}>
        <Text style={[styles.address, { color: isDark ? '#cccccc' : '#666666' }]}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </Text>
        {onCopyAddress && (
          <TouchableOpacity onPress={onCopyAddress} style={styles.copyButton}>
            <Icon
              name="content-copy"
              size={20}
              color={isDark ? '#cccccc' : '#666666'}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  disconnect: {
    color: '#FF3B30',
    fontSize: 14,
  },
  balanceContainer: {
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  address: {
    fontSize: 16,
    fontFamily: 'monospace',
  },
  copyButton: {
    padding: 4,
  },
});

export default WalletCard; 