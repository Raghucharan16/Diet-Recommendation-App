import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { AppProvider, useApp } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/constants';

// Loading component
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.primary }}>
      Diet Recommendation
    </Text>
    <Text style={{ fontSize: 16, color: COLORS.gray, marginTop: 8 }}>
      Loading...
    </Text>
  </View>
);

// Main App Content
const AppContent = () => {
  const { loading, isAuthenticated, userProfile } = useApp();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor={COLORS.white} />
      <AppNavigator />
    </NavigationContainer>
  );
};

// Root App Component
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
