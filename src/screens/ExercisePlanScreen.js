import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useApp } from '../context/AppContext';
import { generateExercisePlan } from '../services/huggingfaceApi';
import { saveExercisePlan } from '../utils/storage';
import { getExerciseRecommendations, getMedicalConditionName } from '../utils/medicalRecommendations';
import { COLORS, SIZES } from '../constants';

const ExercisePlanScreen = ({ navigation }) => {
  const { userProfile, exercisePlan, setExercisePlan } = useApp();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [medicalRecommendations, setMedicalRecommendations] = useState(null);

  useEffect(() => {
    if (!exercisePlan && userProfile) {
      generatePlan();
    }
    if (userProfile && userProfile.medicalConditions) {
      const recommendations = getExerciseRecommendations(userProfile.medicalConditions, userProfile);
      setMedicalRecommendations(recommendations);
    }
  }, [userProfile]);

  const generatePlan = async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      const result = await generateExercisePlan(userProfile);
      
      if (result.success) {
        setExercisePlan(result);
        await saveExercisePlan(result);
      } else {
        console.error('Exercise plan generation failed:', result.error);
      }
    } catch (error) {
      console.error('Error generating exercise plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await generatePlan();
    setRefreshing(false);
  };

  const renderHTML = (htmlContent) => {
    const styledHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 16px;
            background-color: #ffffff;
            color: #333333;
            line-height: 1.6;
          }
          h3 {
            color: #FF9500;
            font-size: 20px;
            margin-top: 24px;
            margin-bottom: 12px;
          }
          p {
            margin: 8px 0;
            font-size: 16px;
          }
          ul {
            padding-left: 20px;
            margin: 8px 0;
          }
          li {
            margin: 4px 0;
            font-size: 15px;
          }
          strong {
            color: #2c3e50;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;
    return styledHTML;
  };

  if (loading && !exercisePlan) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.warning} />
        <Text style={styles.loadingText}>Generating your personalized exercise plan...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.warning} />
        </TouchableOpacity>
        <Text style={styles.title}>Exercise Plan</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
          disabled={refreshing}
        >
          <Ionicons 
            name="refresh" 
            size={24} 
            color={refreshing ? COLORS.gray : COLORS.warning} 
          />
        </TouchableOpacity>
      </View>

      {userProfile && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProfile.exerciseLevel}</Text>
            <Text style={styles.statLabel}>Activity Level</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProfile.healthGoal}</Text>
            <Text style={styles.statLabel}>Goal</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>7 Days</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
        </View>
      )}

      {medicalRecommendations && medicalRecommendations.condition !== 'none' && (
        <View style={styles.medicalSection}>
          <Text style={styles.medicalTitle}>
            Exercise Guidelines for {getMedicalConditionName(medicalRecommendations.condition)}
          </Text>
          
          {medicalRecommendations.exerciseModifications.length > 0 && (
            <View style={styles.medicalCard}>
              <Text style={styles.medicalCardTitle}>🏃‍♂️ Exercise Modifications</Text>
              {medicalRecommendations.exerciseModifications.map((modification, index) => (
                <Text key={index} style={styles.medicalItem}>• {modification}</Text>
              ))}
            </View>
          )}

          {medicalRecommendations.specialNotes.length > 0 && (
            <View style={styles.medicalCard}>
              <Text style={styles.medicalCardTitle}>⚠️ Important Notes</Text>
              {medicalRecommendations.specialNotes.map((note, index) => (
                <Text key={index} style={styles.medicalItem}>• {note}</Text>
              ))}
            </View>
          )}
        </View>
      )}

      {exercisePlan?.data ? (
        <WebView
          source={{ html: renderHTML(exercisePlan.data) }}
          style={styles.webView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <ScrollView 
          style={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.emptyState}>
            <Ionicons name="fitness-outline" size={80} color={COLORS.gray} />
            <Text style={styles.emptyTitle}>No Exercise Plan Available</Text>
            <Text style={styles.emptyDescription}>
              Pull down to refresh and generate your personalized exercise plan
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.warning,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
    textAlign: 'center',
  },
  webView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.gray,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 8,
  },
  medicalSection: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 300,
  },
  medicalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.warning,
    marginBottom: 12,
    textAlign: 'center',
  },
  medicalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medicalCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 6,
  },
  medicalItem: {
    fontSize: 12,
    color: COLORS.darkGray,
    lineHeight: 16,
    marginBottom: 2,
  },
});

export default ExercisePlanScreen;