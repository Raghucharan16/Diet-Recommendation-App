import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { clearAllData } from '../utils/storage';
import { cancelAllNotifications, scheduleMealReminders, scheduleExerciseReminders } from '../services/notificationService';
import { COLORS, SIZES } from '../constants';

const SettingsScreen = ({ navigation }) => {
  const { userProfile, notifications, setNotifications, logout } = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = useState(notifications?.enabled ?? true);
  const [mealReminders, setMealReminders] = useState(notifications?.mealReminders ?? true);
  const [exerciseReminders, setExerciseReminders] = useState(notifications?.exerciseReminders ?? true);

  const handleNotificationToggle = async (type, value) => {
    try {
      if (type === 'enabled') {
        setNotificationsEnabled(value);
        if (value) {
          await scheduleMealReminders();
          await scheduleExerciseReminders();
        } else {
          await cancelAllNotifications();
        }
      } else if (type === 'meal') {
        setMealReminders(value);
        if (value && notificationsEnabled) {
          await scheduleMealReminders();
        }
      } else if (type === 'exercise') {
        setExerciseReminders(value);
        if (value && notificationsEnabled) {
          await scheduleExerciseReminders();
        }
      }

      const newNotifications = {
        enabled: type === 'enabled' ? value : notificationsEnabled,
        mealReminders: type === 'meal' ? value : mealReminders,
        exerciseReminders: type === 'exercise' ? value : exerciseReminders,
      };

      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error updating notifications:', error);
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('ProfileSetup');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.replace('Auth');
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your data including profile, recommendations, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              await cancelAllNotifications();
              logout();
              navigation.replace('Auth');
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={COLORS.primary} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {userProfile && (
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <Ionicons name="person-circle" size={60} color={COLORS.primary} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userProfile.username}</Text>
              <Text style={styles.profileDetails}>
                {userProfile.age} years • {userProfile.gender} • {userProfile.weight}kg
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <SettingItem
          icon="person-outline"
          title="Edit Profile"
          subtitle="Update your health information"
          onPress={handleEditProfile}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <SettingItem
          icon="notifications-outline"
          title="Enable Notifications"
          subtitle="Receive meal and exercise reminders"
          rightComponent={
            <Switch
              value={notificationsEnabled}
              onValueChange={(value) => handleNotificationToggle('enabled', value)}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
            />
          }
        />
        {notificationsEnabled && (
          <>
            <SettingItem
              icon="restaurant-outline"
              title="Meal Reminders"
              subtitle="Daily meal time notifications"
              rightComponent={
                <Switch
                  value={mealReminders}
                  onValueChange={(value) => handleNotificationToggle('meal', value)}
                  trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                />
              }
            />
            <SettingItem
              icon="fitness-outline"
              title="Exercise Reminders"
              subtitle="Daily workout notifications"
              rightComponent={
                <Switch
                  value={exerciseReminders}
                  onValueChange={(value) => handleNotificationToggle('exercise', value)}
                  trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                />
              }
            />
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <SettingItem
          icon="trash-outline"
          title="Clear All Data"
          subtitle="Delete all your data and recommendations"
          onPress={handleClearData}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingItem
          icon="log-out-outline"
          title="Logout"
          subtitle="Sign out of your account"
          onPress={handleLogout}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Diet Recommendation App</Text>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  profileSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.borderRadius,
    padding: 16,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.black,
  },
  profileDetails: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
  },
  settingSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    padding: 32,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  versionText: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
});

export default SettingsScreen;