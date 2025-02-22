import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTheme } from '@/context/ThemeContext';
import WalletCard from '@/components/WalletCard';
import AssetCard from '@/components/AssetCard';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user } = useAppSelector((state) => state.auth);
  const { assets } = useAppSelector((state) => state.assets);
  const { address, balance } = useAppSelector((state) => state.wallet);

  const renderQuickAction = ({ icon, title, onPress, gradient }) => (
    <TouchableOpacity onPress={onPress} style={styles.quickActionButton}>
      <LinearGradient
        colors={gradient}
        style={styles.quickActionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Icon name={icon} type="material-community" color="#FFFFFF" size={24} />
        <Text style={styles.quickActionText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: isDark ? '#ffffff' : '#000000' }]}>
              Welcome back,
            </Text>
            <Text style={[styles.userName, { color: isDark ? '#ffffff' : '#000000' }]}>
              {user?.name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={[styles.profileButton, { backgroundColor: isDark ? '#2a2a2a' : '#ffffff' }]}
          >
            <Icon
              name="account-circle"
              type="material-community"
              color={isDark ? '#ffffff' : '#000000'}
              size={28}
            />
          </TouchableOpacity>
        </View>

        {address ? (
          <WalletCard
            address={address}
            balance={balance}
            onCopyAddress={() => {/* Implement copy to clipboard */}}
          />
        ) : (
          <LinearGradient
            colors={isDark ? ['#2a2a2a', '#1a1a1a'] : ['#ffffff', '#f5f5f5']}
            style={styles.connectCard}
          >
            <Icon
              name="wallet-outline"
              type="material-community"
              color={isDark ? '#ffffff' : '#000000'}
              size={40}
            />
            <Text style={[styles.connectTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
              Connect Wallet
            </Text>
            <Text style={[styles.connectText, { color: isDark ? '#cccccc' : '#666666' }]}>
              Connect your wallet to start trading assets
            </Text>
            <Button
              title="Connect Now"
              onPress={() => navigation.navigate('Wallet')}
              buttonStyle={[styles.connectButton, { backgroundColor: '#007AFF' }]}
              titleStyle={styles.connectButtonText}
            />
          </LinearGradient>
        )}

        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            {renderQuickAction({
              icon: 'plus-circle-outline',
              title: 'Tokenize Asset',
              onPress: () => navigation.navigate('TokenizeAsset'),
              gradient: ['#007AFF', '#00C6FB'],
            })}
            {renderQuickAction({
              icon: 'rocket-launch-outline',
              title: 'Start Campaign',
              onPress: () => navigation.navigate('CreateCampaign'),
              gradient: ['#FF2D55', '#FF9500'],
            })}
            {renderQuickAction({
              icon: 'chart-line',
              title: 'Markets',
              onPress: () => navigation.navigate('Marketplace'),
              gradient: ['#34C759', '#30D158'],
            })}
            {renderQuickAction({
              icon: 'wallet-outline',
              title: 'Portfolio',
              onPress: () => navigation.navigate('Portfolio'),
              gradient: ['#5856D6', '#AF52DE'],
            })}
          </View>
        </View>

        <View style={styles.assets}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
              Your Assets
            </Text>
            <Button
              title="View All"
              type="clear"
              onPress={() => navigation.navigate('Portfolio')}
              titleStyle={{ color: '#007AFF' }}
            />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.assetsScroll}
          >
            {assets.slice(0, 3).map((asset) => (
              <View key={asset.id} style={styles.assetCardContainer}>
                <AssetCard asset={asset} />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 16,
    opacity: 0.8,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  connectCard: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  connectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  connectText: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  connectButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: (width - 48) / 2,
    marginBottom: 16,
  },
  quickActionGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  assets: {
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  assetsScroll: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  assetCardContainer: {
    width: width * 0.75,
    marginRight: 8,
  },
});

export default HomeScreen;

