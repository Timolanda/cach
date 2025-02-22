import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { useTheme } from '@/context/ThemeContext';
import { ValuationResult } from '@/services/valuation/types';
import { formatCurrency, formatPercentage } from '@/utils/format';

interface MarketComparisonProps {
  valuation: ValuationResult;
}

export const MarketComparison: React.FC<MarketComparisonProps> = ({ valuation }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getPerformanceColor = (value: number) => {
    if (value > 0) return '#4CAF50';
    if (value < 0) return '#F44336';
    return isDark ? '#fff' : '#000';
  };

  const getPerformanceIcon = (value: number) => {
    if (value > 0) return 'trending-up';
    if (value < 0) return 'trending-down';
    return 'trending-flat';
  };

  const compareToMarket = () => {
    const marketAvg = valuation.marketData.averagePrice;
    const currentValue = valuation.estimatedValue;
    return ((currentValue - marketAvg) / marketAvg) * 100;
  };

  const marketComparison = compareToMarket();

  return (
    <Card containerStyle={[styles.container, isDark && styles.darkContainer]}>
      <Text style={[styles.title, isDark && styles.darkText]}>Market Comparison</Text>
      
      <View style={styles.mainMetric}>
        <Text style={[styles.metricLabel, isDark && styles.darkText]}>
          Compared to Market Average
        </Text>
        <View style={styles.metricValue}>
          <Icon
            name={getPerformanceIcon(marketComparison)}
            type="material"
            size={24}
            color={getPerformanceColor(marketComparison)}
          />
          <Text style={[
            styles.percentage,
            { color: getPerformanceColor(marketComparison) }
          ]}>
            {formatPercentage(Math.abs(marketComparison))}
          </Text>
          <Text style={[styles.direction, isDark && styles.darkText]}>
            {marketComparison > 0 ? 'above' : 'below'}
          </Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.metricsContainer}>
          <View style={styles.metric}>
            <Text style={[styles.metricLabel, isDark && styles.darkText]}>
              Market Average
            </Text>
            <Text style={[styles.metricValue, isDark && styles.darkText]}>
              {formatCurrency(valuation.marketData.averagePrice)}
            </Text>
          </View>

          <View style={styles.metric}>
            <Text style={[styles.metricLabel, isDark && styles.darkText]}>
              Recent Transactions
            </Text>
            <Text style={[styles.metricValue, isDark && styles.darkText]}>
              {valuation.marketData.recentSales.length}
            </Text>
          </View>

          <View style={styles.metric}>
            <Text style={[styles.metricLabel, isDark && styles.darkText]}>
              Market Volatility
            </Text>
            <Text style={[styles.metricValue, isDark && styles.darkText]}>
              {formatPercentage(valuation.marketData.volatility)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.insights}>
        <Text style={[styles.insightsTitle, isDark && styles.darkText]}>
          Market Insights
        </Text>
        <View style={styles.insightItem}>
          <Icon
            name="info"
            type="material"
            size={20}
            color={isDark ? '#fff' : '#000'}
          />
          <Text style={[styles.insightText, isDark && styles.darkText]}>
            {marketComparison > 0 
              ? 'Asset is valued higher than market average, suggesting strong potential for sale'
              : 'Asset is valued below market average, might be a good time to acquire more'}
          </Text>
        </View>
      </View>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  darkText: {
    color: '#fff',
  },
  mainMetric: {
    alignItems: 'center',
    marginBottom: 24,
  },
  metricValue: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  direction: {
    fontSize: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  metric: {
    marginRight: 24,
    minWidth: 120,
  },
  metricLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  insights: {
    marginTop: 24,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
  },
}); 