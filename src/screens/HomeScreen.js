import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { generateDietPlan, generateExercisePlan } from '../services/huggingfaceApi';
import { saveDietPlan, saveExercisePlan, getDietPlan, getExercisePlan } from '../utils/storage';
import { calculateBMI, getBMICategory } from '../utils/calculations';
import { COLORS, SIZES } from '../constants';

const HomeScreen = ({ navigation }) => {
  const { userProfile, dietPlan, exercisePlan, setDietPlan, setExercisePlan } = useApp();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStoredPlans();
  }, []);

  const loadStoredPlans = async () => {
    try {
      const storedDietPlan = await getDietPlan();
      const storedExercisePlan = await getExercisePlan();
      
      if (storedDietPlan) setDietPlan(storedDietPlan);
      if (storedExercisePlan) setExercisePlan(storedExercisePlan);
    } catch (error) {
      console.error('Error loading stored plans:', error);
    }
  };

  const generateRecommendations = async () => {
    if (!userProfile) {
      Alert.alert('Error', 'Please complete your profile first');
      navigation.navigate('ProfileSetup');
      return;
    }

    setLoading(true);
    try {
      // Generate both diet and exercise plans simultaneously
      const [dietResult, exerciseResult] = await Promise.all([
        generateDietPlan(userProfile),
        generateExercisePlan(userProfile)
      ]);

      if (dietResult.success) {
        setDietPlan(dietResult);
        await saveDietPlan(dietResult);
      } else {
        Alert.alert('Diet Plan Error', dietResult.error);
      }

      if (exerciseResult.success) {
        setExercisePlan(exerciseResult);
        await saveExercisePlan(exerciseResult);
      } else {
        Alert.alert('Exercise Plan Error', exerciseResult.error);
      }

      if (dietResult.success || exerciseResult.success) {
        Alert.alert('Success', 'Your personalized recommendations have been generated!');
      } else {
        Alert.alert('Error', 'Failed to generate recommendations. Please check your internet connection and try again.');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      Alert.alert('Error', 'Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await generateRecommendations();
    setRefreshing(false);
  };

  const getBMIInfo = () => {
    if (userProfile && userProfile.weight && userProfile.height) {
      const bmi = calculateBMI(userProfile.weight, userProfile.height);
      const category = getBMICategory(bmi);
      return { bmi: bmi.toFixed(1), category };
    }
    return null;
  };

  const bmiInfo = getBMIInfo();
  const hasRecommendations = dietPlan || exercisePlan;

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {userProfile?.username || 'User'}!</Text>
        <Text style={styles.subtitle}>Your personalized health companion</Text>
      </View>

      {userProfile && (
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Ionicons name="person-circle" size={50} color={COLORS.primary} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userProfile.username}</Text>
              <Text style={styles.profileDetails}>
                {userProfile.age} years • {userProfile.gender} • {userProfile.weight}kg
              </Text>
            </View>
          </View>
          
          {bmiInfo && (
            <View style={styles.bmiSection}>
              <Text style={styles.bmiTitle}>BMI: {bmiInfo.bmi}</Text>
              <Text style={styles.bmiCategory}>{bmiInfo.category}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.actionsSection}>
        <TouchableOpacity 
          style={[styles.generateButton, loading && styles.disabledButton]}
          onPress={generateRecommendations}
          disabled={loading}
        >
          <Ionicons name="refresh" size={24} color={COLORS.white} />
          <Text style={styles.generateButtonText}>
            {loading ? 'Generating...' : hasRecommendations ? 'Regenerate Plans' : 'Generate Recommendations'}
          </Text>
        </TouchableOpacity>
      </View>

      {hasRecommendations && (
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Your Recommendations</Text>
          
          <TouchableOpacity 
            style={styles.planCard}
            onPress={() => navigation.navigate('DietPlan')}
          >
            <View style={styles.planHeader}>
              <Ionicons name="restaurant" size={30} color={COLORS.secondary} />
              <View style={styles.planInfo}>
                <Text style={styles.planTitle}>Diet Plan</Text>
                <Text style={styles.planDescription}>7-day personalized meal recommendations</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
            </View>
            {dietPlan?.tdee && (
              <Text style={styles.planDetail}>Target: {dietPlan.tdee} calories/day</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.planCard}
            onPress={() => navigation.navigate('ExercisePlan')}
          >
            <View style={styles.planHeader}>
              <Ionicons name="fitness" size={30} color={COLORS.warning} />
              <View style={styles.planInfo}>
                <Text style={styles.planTitle}>Exercise Plan</Text>
                <Text style={styles.planDescription}>7-day personalized workout routine</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {!hasRecommendations && !loading && (
        <View style={styles.emptyState}>
          <Ionicons name="clipboard-outline" size={80} color={COLORS.gray} />
          <Text style={styles.emptyTitle}>No Recommendations Yet</Text>
          <Text style={styles.emptyDescription}>
            Generate your personalized diet and exercise plans to get started
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 4,
  },
  profileCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.borderRadius,
    padding: 16,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  profileDetails: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  bmiSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray + '30',
  },
  bmiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  bmiCategory: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  actionsSection: {
    marginBottom: 24,
  },
  generateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
  },
  generateButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  plansSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planInfo: {
    flex: 1,
    marginLeft: 12,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  planDescription: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  planDetail: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 8,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.gray,
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
});

export default HomeScreen;