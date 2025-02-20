import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import WalletScreen from '../screens/WalletScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TokenizeScreen from '../screens/TokenizeScreen';
import CrowdfundingScreen from '../screens/CrowdfundingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AssetDetailsScreen from '../screens/AssetDetailsScreen';
import CampaignDetailsScreen from '../screens/CampaignDetailsScreen';
import CreateCampaignScreen from '../screens/CreateCampaignScreen';

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Register: undefined;
  TokenizeAsset: undefined;
  Marketplace: undefined;
  Crowdfunding: undefined;
  Wallet: undefined;
  AssetDetails: { assetId: string };
  Profile: { userId: string };
  CampaignDetails: { campaignId: string };
  CreateCampaign: undefined;
};

type TabParamList = {
  Home: undefined;
  Marketplace: undefined;
  Crowdfunding: undefined;
  Wallet: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

interface TabBarIconProps {
  color: string;
  size: number;
}

const MainTabs = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          borderTopColor: isDark ? '#333333' : '#e5e5e5',
        },
        tabBarActiveTintColor: '#4a90e2',
        tabBarInactiveTintColor: isDark ? '#888888' : '#666666',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Marketplace"
        component={MarketplaceScreen}
        options={{
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Icon name="store" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Crowdfunding"
        component={CrowdfundingScreen}
        options={{
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Icon name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Icon name="wallet" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={user ? "Main" : "Login"}
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen 
          name="TokenizeAsset" 
          component={TokenizeScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen 
          name="AssetDetails" 
          component={AssetDetailsScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen 
          name="CampaignDetails" 
          component={CampaignDetailsScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen 
          name="CreateCampaign" 
          component={CreateCampaignScreen}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

