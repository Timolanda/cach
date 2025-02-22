import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Transaction } from '@/types/asset';
import { useTheme } from '@/context/ThemeContext';
import { format } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
  userAddress: string;
  onTransactionPress?: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  userAddress,
  onTransactionPress,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const renderTransaction = ({ item: tx }: { item: Transaction }) => {
    const isOutgoing = tx.from.toLowerCase() === userAddress.toLowerCase();
    
    return (
      <TouchableOpacity
        style={[styles.txContainer, { backgroundColor: isDark ? '#2a2a2a' : '#ffffff' }]}
        onPress={() => onTransactionPress?.(tx)}
      >
        <View style={styles.iconContainer}>
          <Icon
            name={isOutgoing ? 'arrow-top-right' : 'arrow-bottom-left'}
            size={24}
            color={isOutgoing ? '#FF3B30' : '#34C759'}
          />
        </View>
        <View style={styles.txDetails}>
          <Text style={[styles.txType, { color: isDark ? '#ffffff' : '#000000' }]}>
            {isOutgoing ? 'Sent' : 'Received'}
          </Text>
          <Text style={[styles.txAddress, { color: isDark ? '#cccccc' : '#666666' }]}>
            {isOutgoing ? 'To: ' : 'From: '}
            {isOutgoing ? tx.to : tx.from}
          </Text>
        </View>
        <View style={styles.txValue}>
          <Text
            style={[
              styles.amount,
              { color: isOutgoing ? '#FF3B30' : '#34C759' },
            ]}
          >
            {isOutgoing ? '-' : '+'}${tx.value}
          </Text>
          <Text style={[styles.timestamp, { color: isDark ? '#cccccc' : '#666666' }]}>
            {format(new Date(tx.blockNumber * 1000), 'MMM dd, HH:mm')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={transactions}
      renderItem={renderTransaction}
      keyExtractor={(tx) => tx.hash}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  txContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  txDetails: {
    flex: 1,
  },
  txType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  txAddress: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  txValue: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
  },
});

export default TransactionList; 