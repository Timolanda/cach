import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { createCampaign } from '@/store/slices/crowdfundingSlice';
import { useTheme } from '@/context/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateCampaignScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { loading } = useAppSelector((state) => state.crowdfunding);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    minInvestment: '',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.targetAmount || isNaN(Number(formData.targetAmount))) {
      newErrors.targetAmount = 'Valid target amount is required';
    }
    if (!formData.minInvestment || isNaN(Number(formData.minInvestment))) {
      newErrors.minInvestment = 'Valid minimum investment is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(createCampaign({
        ...formData,
        targetAmount: Number(formData.targetAmount),
        minInvestment: Number(formData.minInvestment),
      }));
      navigation.goBack();
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#000000' }]}>
          Create New Campaign
        </Text>

        <Input
          placeholder="Campaign Title"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
          errorMessage={errors.title}
          containerStyle={styles.inputContainer}
          inputStyle={{ color: isDark ? '#ffffff' : '#000000' }}
        />

        <Input
          placeholder="Description"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          errorMessage={errors.description}
          multiline
          numberOfLines={4}
          containerStyle={styles.inputContainer}
          inputStyle={{ color: isDark ? '#ffffff' : '#000000' }}
        />

        <Input
          placeholder="Target Amount ($)"
          value={formData.targetAmount}
          onChangeText={(text) => setFormData({ ...formData, targetAmount: text })}
          errorMessage={errors.targetAmount}
          keyboardType="numeric"
          containerStyle={styles.inputContainer}
          inputStyle={{ color: isDark ? '#ffffff' : '#000000' }}
        />

        <Input
          placeholder="Minimum Investment ($)"
          value={formData.minInvestment}
          onChangeText={(text) => setFormData({ ...formData, minInvestment: text })}
          errorMessage={errors.minInvestment}
          keyboardType="numeric"
          containerStyle={styles.inputContainer}
          inputStyle={{ color: isDark ? '#ffffff' : '#000000' }}
        />

        <Button
          title="Set Deadline"
          onPress={() => setShowDatePicker(true)}
          type="outline"
          containerStyle={styles.dateButtonContainer}
        />

        {showDatePicker && (
          <DateTimePicker
            value={formData.deadline}
            mode="date"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setFormData({ ...formData, deadline: selectedDate });
              }
            }}
          />
        )}

        <Button
          title="Create Campaign"
          onPress={handleSubmit}
          loading={loading}
          containerStyle={styles.submitButtonContainer}
          buttonStyle={[styles.submitButton, { backgroundColor: isDark ? '#007AFF' : '#0A84FF' }]}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  dateButtonContainer: {
    marginBottom: 24,
  },
  submitButtonContainer: {
    marginTop: 16,
  },
  submitButton: {
    paddingVertical: 12,
    borderRadius: 8,
  },
});

export default CreateCampaignScreen;

