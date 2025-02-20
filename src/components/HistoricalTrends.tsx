import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '@/context/ThemeContext';
import { ValuationResult } from '@/services/valuation/types';
import { formatCurrency, formatDate } from '@/utils/format';

interface HistoricalTrendsProps {
  valuation: ValuationResult;
  timeframe?: '1M' | '3M' | '6M' | '1Y' | 'ALL';
}

export const HistoricalTrends: React.FC<HistoricalTrendsProps> = ({ 
  valuation,
  timeframe = '6M'
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const width = Dimensions.get('window').width - 32;

  const chartConfig = {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    backgroundGradientFrom: isDark ? '#1E1E1E' : '#fff',
    backgroundGradientTo: isDark ? '#1E1E1E' : '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  const trendData = {
    labels: valuation.marketData.recentSales.map(sale => 
      formatDate(sale.date, 'MMM D')
    ),
    datasets: [
      {
        data: valuation.marketData.recentSales.map(sale => sale.price),
        color: (opacity = 1) => `rgba(255, 167, 38, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: calculateTrendline(valuation.marketData.recentSales),
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Actual', 'Trend'],
  };

  const predictedTrend = analyzeTrend(valuation.marketData.recentSales);

  return (
    <Card containerStyle={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.darkText]}>Historical Trends</Text>
        <View style={styles.timeframeSelector}>
          {['1M', '3M', '6M', '1Y', 'ALL'].map((tf) => (
            <Text
              key={tf}
              style={[
                styles.timeframeOption,
                tf === timeframe && styles.selectedTimeframe,
                isDark && styles.darkText,
              ]}
            >
              {tf}
            </Text>
          ))}
        </View>
      </View>

      <LineChart
        data={trendData}
        width={width}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={false}
        withInnerLines={false}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        withShadow={false}
        segments={4}
      />

      <View style={styles.trendAnalysis}>
        <View style={styles.trendIndicator}>
          <Icon
            name={predictedTrend.direction === 'up' ? 'trending-up' : 'trending-down'}
            type="material"
            size={24}
            color={predictedTrend.direction === 'up' ? '#4CAF50' : '#F44336'}
          />
          <Text style={[styles.trendText, isDark && styles.darkText]}>
            {predictedTrend.direction === 'up' ? 'Upward Trend' : 'Downward Trend'}
          </Text>
        </View>
        <View style={styles.predictionContainer}>
          <Text style={[styles.predictionLabel, isDark && styles.darkText]}>
            Predicted Change (30 days)
          </Text>
          <Text style={[
            styles.predictionValue,
            { color: predictedTrend.direction === 'up' ? '#4CAF50' : '#F44336' }
          ]}>
            {predictedTrend.direction === 'up' ? '+' : '-'}
            {Math.abs(predictedTrend.predictedChange).toFixed(2)}%
          </Text>
        </View>
      </View>

      <View style={styles.insights}>
        {predictedTrend.factors.map((factor, index) => (
          <View key={index} style={styles.insightItem}>
            <Icon
              name="info"
              type="material"
              size={20}
              color={isDark ? '#fff' : '#000'}
            />
            <Text style={[styles.insightText, isDark && styles.darkText]}>
              {factor}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const calculateTrendline = (sales: { price: number; date: string }[]) => {
  // Simple linear regression
  const xValues = sales.map((_, i) => i);
  const yValues = sales.map(sale => sale.price);
  const n = sales.length;

  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((a, i) => a + (i * yValues[i]), 0);
  const sumXX = xValues.reduce((a, x) => a + (x * x), 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return xValues.map(x => slope * x + intercept);
};

const analyzeTrend = (sales: { price: number; date: string }[]) => {
  const trendline = calculateTrendline(sales);
  const direction = trendline[trendline.length - 1] > trendline[0] ? 'up' : 'down';
  const predictedChange = ((trendline[trendline.length - 1] - trendline[0]) / trendline[0]) * 100;

  return {
    direction,
    predictedChange,
    factors: [
      `Historical price trend shows ${Math.abs(predictedChange).toFixed(1)}% ${direction}ward movement`,
      `Market volatility is ${sales.length > 10 ? 'stabilizing' : 'high'} with ${sales.length} recent transactions`,
      `Consider ${direction === 'up' ? 'holding' : 'acquiring'} based on current trend`,
    ],
  };
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  darkText: {
    color: '#fff',
  },
  timeframeSelector: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#333' : '#f5f5f5',
    borderRadius: 20,
    padding: 4,
  },
  timeframeOption: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
  },
  selectedTimeframe: {
    backgroundColor: isDark ? '#666' : '#fff',
    borderRadius: 16,
    color: isDark ? '#fff' : '#000',
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  trendAnalysis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: isDark ? '#333' : '#eee',
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  predictionContainer: {
    alignItems: 'flex-end',
  },
  predictionLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  predictionValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  insights: {
    marginTop: 16,
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