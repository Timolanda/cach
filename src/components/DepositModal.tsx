import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Overlay, Input, Text } from 'react-native-elements';
import AccessibleButton from './AccessibleButton';

interface DepositModalProps {
  isVisible: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isVisible, onClose, onDeposit }) => {
  const [amount, setAmount] = useState('');

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (depositAmount > 0) {
      onDeposit(depositAmount);
      setAmount('');
    }
  };

  return (
    <Overlay isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.container}>
        <Text h4 style={styles.title}>Deposit Funds</Text>
        <Input
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <AccessibleButton
          title="Deposit"
          onPress={handleDeposit}
          disabled={!amount || parseFloat(amount) <= 0}
          accessibilityLabel="Confirm deposit"
        />
        <AccessibleButton
          title="Cancel"
          onPress={onClose}
          type="outline"
          accessibilityLabel="Cancel deposit"
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
});

export default DepositModal;

