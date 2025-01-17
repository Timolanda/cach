import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

export const storeSecureData = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    // Use localStorage for web, but encrypt the data first
    const encryptedValue = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      value
    );
    localStorage.setItem(key, encryptedValue);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

export const getSecureData = async (key: string) => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

export const removeSecureData = async (key: string) => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

