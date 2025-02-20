import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Asset } from '@/types/asset';
import { useTheme } from '@/context/ThemeContext';

interface AssetCardProps {
  asset: Asset;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handlePress = () => {
    navigation.navigate('AssetDetails', { assetId: asset.id });
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: isDark ? '#2a2a2a' : '#ffffff' }
      ]}
      onPress={handlePress}
    >
      <Text style={[styles.name, { color: isDark ? '#ffffff' : '#000000' }]}>
        {asset.name}
      </Text>
      <Text style={[styles.description, { color: isDark ? '#cccccc' : '#666666' }]}>
        {asset.description}
      </Text>
      <View style={styles.details}>
        <Text style={[styles.price, { color: isDark ? '#ffffff' : '#000000' }]}>
          ${asset.currentPrice.toFixed(2)}
        </Text>
        <Text style={[styles.type, { color: isDark ? '#cccccc' : '#666666' }]}>
          {asset.type}
        </Text>
      </View>
    </TouchableOpacity>
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
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  type: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
});

export default AssetCard; 