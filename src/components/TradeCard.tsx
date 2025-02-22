import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trade } from '@/types/asset';
import { useTheme } from '@/context/ThemeContext';
import { format } from 'date-fns';

interface TradeCardProps {
  trade: Trade;
  onExecute?: () => void;
}

const TradeCard: React.FC<TradeCardProps> = ({ trade, onExecute }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleExecute = () => {
    if (onExecute && trade.status === 'pending') {
      onExecute();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#2a2a2a' : '#ffffff' }]}>
      <View style={styles.header}>
        <Text style={[styles.assetId, { color: isDark ? '#cccccc' : '#666666' }]}>
          Asset ID: {trade.assetId}
        </Text>
        <Text
          style={[
            styles.status,
            {
              color:
                trade.status === 'completed'
                  ? '#4CAF50'
                  : trade.status === 'cancelled'
                  ? '#F44336'
                  : '#FF9800',
            },
          ]}
        >
          {trade.status}
        </Text>
      </View>
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: isDark ? '#cccccc' : '#666666' }]}>Seller:</Text>
          <Text style={[styles.value, { color: isDark ? '#ffffff' : '#000000' }]}>
            {trade.sellerAddress.slice(0, 6)}...{trade.sellerAddress.slice(-4)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: isDark ? '#cccccc' : '#666666' }]}>Buyer:</Text>
          <Text style={[styles.value, { color: isDark ? '#ffffff' : '#000000' }]}>
            {trade.buyerAddress
              ? `${trade.buyerAddress.slice(0, 6)}...${trade.buyerAddress.slice(-4)}`
              : 'Not assigned'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: isDark ? '#cccccc' : '#666666' }]}>Amount:</Text>
          <Text style={[styles.value, { color: isDark ? '#ffffff' : '#000000' }]}>
            {trade.amount} tokens
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: isDark ? '#cccccc' : '#666666' }]}>Price:</Text>
          <Text style={[styles.value, { color: isDark ? '#ffffff' : '#000000' }]}>
            ${trade.price.toFixed(2)}
          </Text>
        </View>
      </View>
      {trade.status === 'pending' && onExecute && (
        <TouchableOpacity style={styles.executeButton} onPress={handleExecute}>
          <Text style={styles.executeButtonText}>Execute Trade</Text>
        </TouchableOpacity>
      )}
      <Text style={[styles.date, { color: isDark ? '#cccccc' : '#666666' }]}>
        {format(new Date(trade.createdAt), 'MMM dd, yyyy HH:mm')}
      </Text>
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
    marginBottom: 12,
  },
  assetId: {
    fontSize: 14,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  executeButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  executeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    textAlign: 'right',
  },
});

export default TradeCard; 