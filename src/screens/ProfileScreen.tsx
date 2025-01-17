import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, ListItem, Button, Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/user/profile');
      setUser(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
    } catch (err) {
      setError('Failed to fetch user data');
    }
  };

  const handleSave = async () => {
    try {
      await api.put('/user/profile', { name, email });
      setEditing(false);
      fetchUserData();
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigation.navigate('Login');
    } catch (err) {
      setError('Failed to logout');
    }
  };

  const menuItems = [
    { title: 'Security', icon: 'lock-closed-outline', onPress: () => console.log('Navigate to Security') },
    { title: 'Notifications', icon: 'notifications-outline', onPress: () => console.log('Navigate to Notifications') },
    { title: 'Payment Methods', icon: 'card-outline', onPress: () => console.log('Navigate to Payment Methods') },
    { title: 'Help & Support', icon: 'help-circle-outline', onPress: () => console.log('Navigate to Help & Support') },
    { title: 'About', icon: 'information-circle-outline', onPress: () => console.log('Navigate to About') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Avatar
            rounded
            size="large"
            source={{ uri: user?.avatar || 'https://via.placeholder.com/150' }}
            containerStyle={styles.avatar}
          />
          {editing ? (
            <View>
              <Input
                placeholder="Name"
                value={name}
                onChangeText={setName}
              />
              <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <Button title="Save" onPress={handleSave} buttonStyle={styles.saveButton} />
            </View>
          ) : (
            <View>
              <Text style={styles.name}>{user?.name}</Text>
              <Text style={styles.email}>{user?.email}</Text>
              <Button title="Edit Profile" onPress={() => setEditing(true)} buttonStyle={styles.editButton} />
            </View>
          )}
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <ListItem key={index} bottomDivider onPress={item.onPress}>
              <ListItem.Content>
                <ListItem.Title>{item.title}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          ))}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          title="Log Out"
          onPress={handleLogout}
          buttonStyle={styles.logoutButton}
          containerStyle={styles.logoutButtonContainer}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  avatar: {
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 5,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#F44336',
    borderRadius: 5,
  },
  logoutButtonContainer: {
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ProfileScreen;

