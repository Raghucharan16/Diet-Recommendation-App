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
import { generateDietPlan } from '../services/huggingfaceApi';
import { saveDietPlan } from '../utils/storage';
import { COLORS, SIZES } from '../constants';

const DietPlanScreen = ({ navigation }) => {
  const { userProfile, dietPlan, setDietPlan } = useApp();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!dietPlan && userProfile) {
      generatePlan();
    }
  }, []);

  const generatePlan = async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      const result = await generateDietPlan(userProfile);
      
      if (result.success) {
        setDietPlan(result);
        await saveDietPlan(result);
      } else {
        console.error('Diet plan generation failed:', result.error);
      }
    } catch (error) {
      console.error('Error generating diet plan:', error);
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
            color: #4A90E2;
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

  if (loading && !dietPlan) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Generating your personalized diet plan...</Text>
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
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Diet Plan</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
          disabled={refreshing}
        >
          <Ionicons 
            name="refresh" 
            size={24} 
            color={refreshing ? COLORS.gray : COLORS.primary} 
          />
        </TouchableOpacity>
      </View>

      {dietPlan?.bmr && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{dietPlan.bmr}</Text>
            <Text style={styles.statLabel}>BMR</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{dietPlan.tdee}</Text>
            <Text style={styles.statLabel}>TDEE</Text>
          </View>
          {dietPlan.macros && (
            <>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{dietPlan.macros.carbs}g</Text>
                <Text style={styles.statLabel}>Carbs</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{dietPlan.macros.protein}g</Text>
                <Text style={styles.statLabel}>Protein</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{dietPlan.macros.fat}g</Text>
                <Text style={styles.statLabel}>Fat</Text>
              </View>
            </>
          )}
        </View>
      )}

      {dietPlan?.data ? (
        <WebView
          source={{ html: renderHTML(dietPlan.data) }}
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
            <Ionicons name="restaurant-outline" size={80} color={COLORS.gray} />
            <Text style={styles.emptyTitle}>No Diet Plan Available</Text>
            <Text style={styles.emptyDescription}>
              Pull down to refresh and generate your personalized diet plan
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
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
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
});

export default DietPlanScreen;