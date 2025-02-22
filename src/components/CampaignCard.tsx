import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ProgressBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Campaign } from '@/types/crowdfunding';
import { useTheme } from '@/context/ThemeContext';
import { format } from 'date-fns';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const progress = campaign.raisedAmount / campaign.targetAmount;
  const remainingDays = Math.ceil(
    (new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const handlePress = () => {
    navigation.navigate('CampaignDetails', { campaignId: campaign.id });
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: isDark ? '#2a2a2a' : '#ffffff' }]}
      onPress={handlePress}
    >
      <Text style={[styles.title, { color: isDark ? '#ffffff' : '#000000' }]}>
        {campaign.title}
      </Text>
      <Text style={[styles.description, { color: isDark ? '#cccccc' : '#666666' }]}>
        {campaign.description}
      </Text>
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} color="#007AFF" style={styles.progressBar} />
        <View style={styles.progressDetails}>
          <Text style={[styles.amount, { color: isDark ? '#ffffff' : '#000000' }]}>
            ${campaign.raisedAmount.toLocaleString()} / ${campaign.targetAmount.toLocaleString()}
          </Text>
          <Text style={[styles.days, { color: isDark ? '#cccccc' : '#666666' }]}>
            {remainingDays} days left
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={[styles.minInvestment, { color: isDark ? '#cccccc' : '#666666' }]}>
          Min. Investment: ${campaign.minInvestment}
        </Text>
        <Text
          style={[
            styles.status,
            { color: campaign.status === 'active' ? '#4CAF50' : '#FF9800' },
          ]}
        >
          {campaign.status}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
  },
  days: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  minInvestment: {
    fontSize: 14,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export default CampaignCard; 