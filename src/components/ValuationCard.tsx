import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Divider, Icon } from 'react-native-elements';
import { useTheme } from '@/context/ThemeContext';
import { ValuationResult } from '@/services/valuation/types';
import { formatCurrency } from '@/utils/format';

interface ValuationCardProps {
  valuation: ValuationResult;
}

export const ValuationCard: React.FC<ValuationCardProps> = ({ valuation }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#4CAF50';
    if (confidence >= 0.6) return '#FFC107';
    return '#F44336';
  };

  return (
    <Card containerStyle={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.darkText]}>Asset Valuation</Text>
        <View style={styles.confidenceContainer}>
          <Text style={[styles.confidenceLabel, isDark && styles.darkText]}>
            Confidence:
          </Text>
          <View style={[
            styles.confidenceBadge,
            { backgroundColor: getConfidenceColor(valuation.confidence) }
          ]}>
            <Text style={styles.confidenceValue}>
              {Math.round(valuation.confidence * 100)}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.valueContainer}>
        <Text style={[styles.valueLabel, isDark && styles.darkText]}>
          Estimated Value
        </Text>
        <Text style={[styles.value, isDark && styles.darkText]}>
          {formatCurrency(valuation.estimatedValue)}
        </Text>
      </View>

      <Divider style={styles.divider} />

      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
        Key Factors
      </Text>
      <ScrollView style={styles.factorsContainer}>
        {valuation.factors.slice(0, 5).map((factor, index) => (
          <View key={index} style={styles.factorRow}>
            <Icon
              name="trending-up"
              type="material"
              size={20}
              color={isDark ? '#fff' : '#000'}
            />
            <View style={styles.factorInfo}>
              <Text style={[styles.factorName, isDark && styles.darkText]}>
                {factor.name}
              </Text>
              <Text style={[styles.factorDescription, isDark && styles.darkText]}>
                {factor.description}
              </Text>
            </View>
            <Text style={[styles.factorValue, isDark && styles.darkText]}>
              {(factor.weight * 100).toFixed(1)}%
            </Text>
          </View>
        ))}
      </ScrollView>

      <Divider style={styles.divider} />

      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
        Recommendations
      </Text>
      <ScrollView style={styles.recommendationsContainer}>
        {valuation.recommendations.map((recommendation, index) => (
          <View key={index} style={styles.recommendationRow}>
            <Icon
              name="lightbulb"
              type="material"
              size={20}
              color={isDark ? '#fff' : '#000'}
            />
            <Text style={[styles.recommendation, isDark && styles.darkText]}>
              {recommendation}
            </Text>
          </View>
        ))}
      </ScrollView>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  darkContainer: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
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
  darkText: {
    color: '#fff',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceLabel: {
    marginRight: 8,
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceValue: {
    color: '#fff',
    fontWeight: 'bold',
  },
  valueContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  valueLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  factorsContainer: {
    maxHeight: 200,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  factorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  factorName: {
    fontSize: 16,
    fontWeight: '500',
  },
  factorDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  factorValue: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  recommendationsContainer: {
    maxHeight: 150,
  },
  recommendationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendation: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
  },
}); 