import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_PROFILE: 'userProfile',
  USER_CREDENTIALS: 'userCredentials',
  DIET_PLAN: 'dietPlan',
  EXERCISE_PLAN: 'exercisePlan',
  NOTIFICATIONS_ENABLED: 'notificationsEnabled',
  PROGRESS_DATA: 'progressData',
};

// User Profile Management
export const saveUserProfile = async (profile) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    return false;
  }
};

export const getUserProfile = async () => {
  try {
    const profile = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// User Credentials Management
export const saveUserCredentials = async (credentials) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_CREDENTIALS, JSON.stringify(credentials));
    return true;
  } catch (error) {
    console.error('Error saving user credentials:', error);
    return false;
  }
};

export const getUserCredentials = async () => {
  try {
    const credentials = await AsyncStorage.getItem(STORAGE_KEYS.USER_CREDENTIALS);
    return credentials ? JSON.parse(credentials) : null;
  } catch (error) {
    console.error('Error getting user credentials:', error);
    return null;
  }
};

// Diet Plan Management
export const saveDietPlan = async (dietPlan) => {
  try {
    const planWithTimestamp = {
      ...dietPlan,
      timestamp: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.DIET_PLAN, JSON.stringify(planWithTimestamp));
    return true;
  } catch (error) {
    console.error('Error saving diet plan:', error);
    return false;
  }
};

export const getDietPlan = async () => {
  try {
    const dietPlan = await AsyncStorage.getItem(STORAGE_KEYS.DIET_PLAN);
    return dietPlan ? JSON.parse(dietPlan) : null;
  } catch (error) {
    console.error('Error getting diet plan:', error);
    return null;
  }
};

// Exercise Plan Management
export const saveExercisePlan = async (exercisePlan) => {
  try {
    const planWithTimestamp = {
      ...exercisePlan,
      timestamp: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.EXERCISE_PLAN, JSON.stringify(planWithTimestamp));
    return true;
  } catch (error) {
    console.error('Error saving exercise plan:', error);
    return false;
  }
};

export const getExercisePlan = async () => {
  try {
    const exercisePlan = await AsyncStorage.getItem(STORAGE_KEYS.EXERCISE_PLAN);
    return exercisePlan ? JSON.parse(exercisePlan) : null;
  } catch (error) {
    console.error('Error getting exercise plan:', error);
    return null;
  }
};

// Clear all data
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

// Progress Data Management
export const saveProgressData = async (progressData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS_DATA, JSON.stringify(progressData));
    return true;
  } catch (error) {
    console.error('Error saving progress data:', error);
    return false;
  }
};

export const getProgressData = async () => {
  try {
    const progressData = await AsyncStorage.getItem(STORAGE_KEYS.PROGRESS_DATA);
    return progressData ? JSON.parse(progressData) : {};
  } catch (error) {
    console.error('Error getting progress data:', error);
    return {};
  }
};

// Check if user is logged in
export const isUserLoggedIn = async () => {
  try {
    const credentials = await getUserCredentials();
    const profile = await getUserProfile();
    return credentials && profile;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};
