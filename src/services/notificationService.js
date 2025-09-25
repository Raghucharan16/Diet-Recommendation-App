import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Notification permission not granted');
      return false;
    }
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('diet-reminders', {
        name: 'Diet Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// Schedule daily meal reminders
export const scheduleMealReminders = async () => {
  try {
    // Cancel existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    const mealTimes = [
      { time: { hour: 8, minute: 0 }, title: 'Breakfast Time!', body: 'Start your day with a healthy breakfast 🍳' },
      { time: { hour: 13, minute: 0 }, title: 'Lunch Time!', body: 'Time for a nutritious lunch 🥗' },
      { time: { hour: 19, minute: 0 }, title: 'Dinner Time!', body: 'Enjoy your healthy dinner 🍽️' },
      { time: { hour: 21, minute: 0 }, title: 'Evening Snack', body: 'Time for a light, healthy snack 🍎' },
    ];
    
    for (const meal of mealTimes) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: meal.title,
          body: meal.body,
          categoryIdentifier: 'diet-reminder',
        },
        trigger: {
          hour: meal.time.hour,
          minute: meal.time.minute,
          repeats: true,
        },
      });
    }
    
    console.log('Meal reminders scheduled successfully');
    return true;
  } catch (error) {
    console.error('Error scheduling meal reminders:', error);
    return false;
  }
};

// Schedule exercise reminders
export const scheduleExerciseReminders = async () => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Workout Time! 💪',
        body: 'Time to get moving with your exercise routine',
        categoryIdentifier: 'exercise-reminder',
      },
      trigger: {
        hour: 17, // 5 PM
        minute: 0,
        repeats: true,
      },
    });
    
    console.log('Exercise reminders scheduled successfully');
    return true;
  } catch (error) {
    console.error('Error scheduling exercise reminders:', error);
    return false;
  }
};

// Cancel all notifications
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications canceled');
    return true;
  } catch (error) {
    console.error('Error canceling notifications:', error);
    return false;
  }
};

// Get notification token (for future push notification features)
export const getNotificationToken = async () => {
  try {
    const token = await Notifications.getExpoPushTokenAsync();
    console.log('Notification token:', token);
    return token.data;
  } catch (error) {
    console.error('Error getting notification token:', error);
    return null;
  }
};