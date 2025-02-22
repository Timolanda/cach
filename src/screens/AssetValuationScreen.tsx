import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useAssetValuation } from '@/hooks/useAssetValuation';
import { ValuationCard } from '@/components/ValuationCard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useTheme } from '@/context/ThemeContext';
import { RootStackParamList } from '@/navigation/types';
import { ValuationCharts } from '@/components/ValuationCharts';
import { MarketComparison } from '@/components/MarketComparison';
import { HistoricalTrends } from '@/components/HistoricalTrends';

type AssetValuationScreenRouteProp = RouteProp<RootStackParamList, 'AssetValuation'>;

export const AssetValuationScreen: React.FC = () => {
  const route = useRoute<AssetValuationScreenRouteProp>();
  const { asset } = route.params;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const {
    valuation,
    loading,
    error,
    getValuation
  } = useAssetValuation(asset);

  useEffect(() => {
    getValuation();
  }, [getValuation]);

  if (loading && !valuation) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={getValuation} />;
  }

  return (
    <ScrollView
      style={[styles.container, isDark && styles.darkContainer]}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={getValuation}
          tintColor={isDark ? '#fff' : '#000'}
        />
      }
    >
      {valuation && (
        <>
          <ValuationCard valuation={valuation} />
          <MarketComparison valuation={valuation} />
          <HistoricalTrends valuation={valuation} />
          <ValuationCharts valuation={valuation} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
}); 