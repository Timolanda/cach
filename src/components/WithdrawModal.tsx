import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Overlay, Input, Text } from 'react-native-elements';
import AccessibleButton from './AccessibleButton';

interface WithdrawModalProps {
  isVisible: boolean;
  onClose: () => void;
  onWithdraw: (amount: number) => void;
  maxAmount: number;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isVisible, onClose, onWithdraw, maxAmount }) => {
  const [amount, setAmount] = useState('');

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > 0 && withdrawAmount <= maxAmount) {
      onWithdraw(withdrawAmount);
      setAmount('');
    }
  };

  return (
    <Overlay isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.container}>
        <Text h4 style={styles.title}>Withdraw Funds</Text>
        <Input
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <Text style={styles.maxAmount}>Maximum withdrawal: ${maxAmount.toFixed(2)}</Text>
        <AccessibleButton
          title="Withdraw"
          onPress={handleWithdraw}
          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxAmount}
          accessibilityLabel="Confirm withdrawal"
        />
        <AccessibleButton
          title="Cancel"
          onPress={onClose}
          type="outline"
          accessibilityLabel="Cancel withdrawal"
        />
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  maxAmount: {
    marginBottom: 10,
    textAlign: 'center',
    color: '#666',
  },
});

export default WithdrawModal;

