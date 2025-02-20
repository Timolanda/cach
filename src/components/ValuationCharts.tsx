import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Card } from 'react-native-elements';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useTheme } from '@/context/ThemeContext';
import { ValuationResult } from '@/services/valuation/types';
import { formatCurrency } from '@/utils/format';

interface ValuationChartsProps {
  valuation: ValuationResult;
}

export const ValuationCharts: React.FC<ValuationChartsProps> = ({ valuation }) => {
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

  const historicalData = {
    labels: valuation.marketData.recentSales.map(sale => 
      new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [{
      data: valuation.marketData.recentSales.map(sale => sale.price),
      color: (opacity = 1) => `rgba(255, 167, 38, ${opacity})`,
      strokeWidth: 2,
    }],
  };

  const factorsData = {
    labels: valuation.factors.slice(0, 5).map(factor => factor.name),
    datasets: [{
      data: valuation.factors.slice(0, 5).map(factor => factor.weight * 100),
    }],
  };

  return (
    <Card containerStyle={[styles.container, isDark && styles.darkContainer]}>
      <Text style={[styles.title, isDark && styles.darkText]}>Historical Prices</Text>
      <LineChart
        data={historicalData}
        width={width}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />

      <Text style={[styles.title, isDark && styles.darkText, styles.marginTop]}>
        Valuation Factors Impact
      </Text>
      <BarChart
        data={factorsData}
        width={width}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        verticalLabelRotation={30}
        showValuesOnTopOfBars
      />

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, isDark && styles.darkText]}>
            Price Range
          </Text>
          <Text style={[styles.statValue, isDark && styles.darkText]}>
            {formatCurrency(valuation.marketData.priceRange.min)} - 
            {formatCurrency(valuation.marketData.priceRange.max)}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, isDark && styles.darkText]}>
            Volatility
          </Text>
          <Text style={[styles.statValue, isDark && styles.darkText]}>
            {(valuation.marketData.volatility * 100).toFixed(1)}%
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
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  marginTop: {
    marginTop: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 