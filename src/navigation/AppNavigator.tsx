import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import WalletScreen from '../screens/WalletScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TokenizeAssetScreen from '../screens/TokenizeAssetScreen';
import CrowdfundingScreen from '../screens/CrowdfundingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AssetDetailsScreen from '../screens/AssetDetailsScreen';
import CampaignDetailsScreen from '../screens/CampaignDetailsScreen';
import CreateCampaignScreen from '../screens/CreateCampaignScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Marketplace') {
          iconName = focused ? 'cart' : 'cart-outline';
        } else if (route.name === 'Wallet') {
          iconName = focused ? 'wallet' : 'wallet-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === 'Crowdfunding') {
          iconName = focused ? 'people' : 'people-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
    <Tab.Screen name="Wallet" component={WalletScreen} />
    <Tab.Screen name="Crowdfunding" component={CrowdfundingScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="TokenizeAsset" component={TokenizeAssetScreen} />
      <Stack.Screen name="AssetDetails" component={AssetDetailsScreen} />
      <Stack.Screen name="CampaignDetails" component={CampaignDetailsScreen} />
      <Stack.Screen name="CreateCampaign" component={CreateCampaignScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;

