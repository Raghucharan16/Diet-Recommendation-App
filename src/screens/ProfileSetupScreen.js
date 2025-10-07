import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { saveUserProfile } from '../utils/storage';
import { requestNotificationPermissions, scheduleMealReminders, scheduleExerciseReminders } from '../services/notificationService';
import { COLORS, SIZES, GENDERS, ACTIVITY_LEVELS, HEALTH_GOALS, DIETARY_PREFERENCES, MEDICAL_CONDITIONS } from '../constants';

const ProfileSetupScreen = ({ navigation }) => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState('');
  const [healthGoal, setHealthGoal] = useState('');
  const [exerciseLevel, setExerciseLevel] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('none');
  const [loading, setLoading] = useState(false);
  
  const { userProfile, updateProfile } = useApp();

  // Pre-fill form if profile exists
  useEffect(() => {
    if (userProfile) {
      setAge(userProfile.age?.toString() || '');
      setGender(userProfile.gender || '');
      setWeight(userProfile.weight?.toString() || '');
      setHeight(userProfile.height?.toString() || '');
      setDietaryPreference(userProfile.dietaryPreference || '');
      setHealthGoal(userProfile.healthGoal || '');
      setExerciseLevel(userProfile.exerciseLevel || '');
      setMedicalConditions(userProfile.medicalConditions || 'none');
    }
  }, [userProfile]);

  const validateForm = () => {
    if (!age || isNaN(age) || age < 13 || age > 120) {
      Alert.alert('Error', 'Please enter a valid age (13-120)');
      return false;
    }
    
    if (!gender) {
      Alert.alert('Error', 'Please select your gender');
      return false;
    }
    
    if (!weight || isNaN(weight) || weight < 20 || weight > 300) {
      Alert.alert('Error', 'Please enter a valid weight (20-300 kg)');
      return false;
    }
    
    if (!height || isNaN(height) || height < 100 || height > 250) {
      Alert.alert('Error', 'Please enter a valid height (100-250 cm)');
      return false;
    }
    
    if (!dietaryPreference) {
      Alert.alert('Error', 'Please select your dietary preference');
      return false;
    }
    
    if (!healthGoal) {
      Alert.alert('Error', 'Please select your health goal');
      return false;
    }
    
    if (!exerciseLevel) {
      Alert.alert('Error', 'Please select your exercise level');
      return false;
    }
    
    if (!medicalConditions) {
      Alert.alert('Error', 'Please select your medical condition status');
      return false;
    }
    
    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const profile = {
        age: parseInt(age),
        gender,
        weight: parseFloat(weight),
        height: parseFloat(height),
        dietaryPreference,
        healthGoal,
        exerciseLevel,
        medicalConditions,
        updatedAt: new Date().toISOString(),
      };

      const saved = await saveUserProfile(profile);
      
      if (saved) {
        updateProfile(profile);
        
        // Request notification permissions and set up reminders
        const notificationPermission = await requestNotificationPermissions();
        if (notificationPermission) {
          await scheduleMealReminders();
          await scheduleExerciseReminders();
        }
        
        Alert.alert(
          'Success', 
          'Profile saved successfully! You can now get personalized recommendations.',
          [
            { text: 'OK', onPress: () => navigation.replace('MainTabs') }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('Profile save error:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const PickerItem = ({ label, value, selectedValue, onValueChange, items }) => (
    <View style={styles.pickerContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          <Picker.Item label={`Select ${label}`} value="" />
          {items.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="person-circle" size={80} color={COLORS.primary} />
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Help us personalize your recommendations</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter age"
                placeholderTextColor={COLORS.gray}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.halfInput}>
              <PickerItem
                label="Gender"
                selectedValue={gender}
                onValueChange={setGender}
                items={GENDERS}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter weight"
                placeholderTextColor={COLORS.gray}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.halfInput}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter height"
                placeholderTextColor={COLORS.gray}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
              />
            </View>
          </View>

          <PickerItem
            label="Dietary Preference"
            selectedValue={dietaryPreference}
            onValueChange={setDietaryPreference}
            items={DIETARY_PREFERENCES}
          />

          <PickerItem
            label="Health Goal"
            selectedValue={healthGoal}
            onValueChange={setHealthGoal}
            items={HEALTH_GOALS}
          />

          <PickerItem
            label="Exercise Level"
            selectedValue={exerciseLevel}
            onValueChange={setExerciseLevel}
            items={ACTIVITY_LEVELS}
          />

          <PickerItem
            label="Medical Conditions"
            selectedValue={medicalConditions}
            onValueChange={setMedicalConditions}
            items={MEDICAL_CONDITIONS}
          />

          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.disabledButton]} 
            onPress={handleSaveProfile}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving Profile...' : 'Save Profile & Get Recommendations'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SIZES.padding,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfInput: {
    flex: 0.48,
  },
  label: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.borderRadius,
    height: 50,
    paddingHorizontal: 16,
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerWrapper: {
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.borderRadius,
  },
  picker: {
    height: 50,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ProfileSetupScreen;