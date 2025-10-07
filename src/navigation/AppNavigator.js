import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import HomeScreen from '../screens/HomeScreen';
import DietPlanScreen from '../screens/DietPlanScreen';
import ExercisePlanScreen from '../screens/ExercisePlanScreen';
import CalendarScreen from '../screens/CalendarScreen';
import SettingsScreen from '../screens/SettingsScreen';

import { COLORS } from '../constants';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack Navigator
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'DietPlan') {
          iconName = focused ? 'restaurant' : 'restaurant-outline';
        } else if (route.name === 'ExercisePlan') {
          iconName = focused ? 'fitness' : 'fitness-outline';
        } else if (route.name === 'Calendar') {
          iconName = focused ? 'calendar' : 'calendar-outline';
        } else if (route.name === 'Settings') {
          iconName = focused ? 'settings' : 'settings-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.gray,
      tabBarStyle: {
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
      headerShown: false,
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ tabBarLabel: 'Home' }}
    />
    <Tab.Screen 
      name="DietPlan" 
      component={DietPlanScreen}
      options={{ tabBarLabel: 'Diet' }}
    />
    <Tab.Screen 
      name="ExercisePlan" 
      component={ExercisePlanScreen}
      options={{ tabBarLabel: 'Exercise' }}
    />
    <Tab.Screen 
      name="Calendar" 
      component={CalendarScreen}
      options={{ tabBarLabel: 'Progress' }}
    />
    <Tab.Screen 
      name="Settings" 
      component={SettingsScreen}
      options={{ tabBarLabel: 'Settings' }}
    />
  </Tab.Navigator>
);

// Main Stack Navigator
const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Auth" component={AuthStack} />
    <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    <Stack.Screen name="MainTabs" component={MainTabs} />
  </Stack.Navigator>
);

export default AppNavigator;