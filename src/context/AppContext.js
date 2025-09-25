import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getUserProfile, getUserCredentials, isUserLoggedIn } from '../utils/storage';

// Initial state
const initialState = {
  user: null,
  userProfile: null,
  isAuthenticated: false,
  loading: true,
  dietPlan: null,
  exercisePlan: null,
  notifications: {
    enabled: true,
    mealReminders: true,
    exerciseReminders: true,
  },
};

// Action types
export const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_USER_PROFILE: 'SET_USER_PROFILE',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  SET_DIET_PLAN: 'SET_DIET_PLAN',
  SET_EXERCISE_PLAN: 'SET_EXERCISE_PLAN',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  LOGOUT: 'LOGOUT',
  RESET_STATE: 'RESET_STATE',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTION_TYPES.SET_USER:
      return { ...state, user: action.payload };
    
    case ACTION_TYPES.SET_USER_PROFILE:
      return { ...state, userProfile: action.payload };
    
    case ACTION_TYPES.SET_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload };
    
    case ACTION_TYPES.SET_DIET_PLAN:
      return { ...state, dietPlan: action.payload };
    
    case ACTION_TYPES.SET_EXERCISE_PLAN:
      return { ...state, exercisePlan: action.payload };
    
    case ACTION_TYPES.SET_NOTIFICATIONS:
      return { ...state, notifications: { ...state.notifications, ...action.payload } };
    
    case ACTION_TYPES.LOGOUT:
      return {
        ...initialState,
        loading: false,
      };
    
    case ACTION_TYPES.RESET_STATE:
      return initialState;
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      
      const isLoggedIn = await isUserLoggedIn();
      
      if (isLoggedIn) {
        const credentials = await getUserCredentials();
        const profile = await getUserProfile();
        
        dispatch({ type: ACTION_TYPES.SET_USER, payload: credentials });
        dispatch({ type: ACTION_TYPES.SET_USER_PROFILE, payload: profile });
        dispatch({ type: ACTION_TYPES.SET_AUTHENTICATED, payload: true });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
    }
  };

  // Action creators
  const actions = {
    setLoading: (loading) => dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading }),
    
    setUser: (user) => dispatch({ type: ACTION_TYPES.SET_USER, payload: user }),
    
    setUserProfile: (profile) => dispatch({ type: ACTION_TYPES.SET_USER_PROFILE, payload: profile }),
    
    setAuthenticated: (authenticated) => dispatch({ type: ACTION_TYPES.SET_AUTHENTICATED, payload: authenticated }),
    
    setDietPlan: (plan) => dispatch({ type: ACTION_TYPES.SET_DIET_PLAN, payload: plan }),
    
    setExercisePlan: (plan) => dispatch({ type: ACTION_TYPES.SET_EXERCISE_PLAN, payload: plan }),
    
    setNotifications: (notifications) => dispatch({ type: ACTION_TYPES.SET_NOTIFICATIONS, payload: notifications }),
    
    logout: () => dispatch({ type: ACTION_TYPES.LOGOUT }),
    
    resetState: () => dispatch({ type: ACTION_TYPES.RESET_STATE }),
    
    // Combined login action
    login: (user, profile) => {
      dispatch({ type: ACTION_TYPES.SET_USER, payload: user });
      dispatch({ type: ACTION_TYPES.SET_USER_PROFILE, payload: profile });
      dispatch({ type: ACTION_TYPES.SET_AUTHENTICATED, payload: true });
    },
    
    // Update profile action
    updateProfile: (profile) => {
      dispatch({ type: ACTION_TYPES.SET_USER_PROFILE, payload: profile });
    },
  };

  const value = {
    ...state,
    ...actions,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;