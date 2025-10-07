import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { saveProgressData, getProgressData } from '../utils/storage';
import { COLORS, SIZES, COLORS_EXTENDED } from '../constants';

const { width } = Dimensions.get('window');
const CALENDAR_WIDTH = width - 40;
const DAY_SIZE = (CALENDAR_WIDTH - 60) / 7;

const CalendarScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [progressData, setProgressData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const { userProfile } = useApp();

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const data = await getProgressData();
      setProgressData(data || {});
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
  };

  const saveProgress = async (dateString, status) => {
    try {
      const newProgressData = {
        ...progressData,
        [dateString]: {
          ...progressData[dateString],
          status,
          timestamp: new Date().toISOString(),
        }
      };
      
      setProgressData(newProgressData);
      await saveProgressData(newProgressData);
    } catch (error) {
      console.error('Error saving progress:', error);
      Alert.alert('Error', 'Failed to save progress data');
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDateString = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getDayStatus = (date) => {
    if (!date) return null;
    const dateString = formatDateString(date);
    return progressData[dateString]?.status || 'untracked';
  };

  const getDayColor = (status, isToday, isPast) => {
    if (isToday) {
      return COLORS.primary;
    }
    
    switch (status) {
      case 'followed':
        return '#4CAF50'; // Green
      case 'not-followed':
        return '#F44336'; // Red
      case 'partially-followed':
        return '#FF9800'; // Orange
      default:
        return isPast ? COLORS.lightGray : COLORS.white;
    }
  };

  const handleDayPress = (date) => {
    if (!date) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(date);
    selectedDay.setHours(0, 0, 0, 0);
    
    // Only allow marking for today and past days
    if (selectedDay > today) {
      Alert.alert('Info', 'You can only track progress for today and past days');
      return;
    }
    
    setSelectedDate(date);
    showProgressOptions(date);
  };

  const showProgressOptions = (date) => {
    const dateString = formatDateString(date);
    const currentStatus = progressData[dateString]?.status || 'untracked';
    
    Alert.alert(
      'Track Progress',
      `How well did you follow your plan on ${date.toDateString()}?`,
      [
        {
          text: 'Followed Completely',
          onPress: () => saveProgress(dateString, 'followed'),
          style: 'default'
        },
        {
          text: 'Partially Followed',
          onPress: () => saveProgress(dateString, 'partially-followed'),
          style: 'default'
        },
        {
          text: 'Did Not Follow',
          onPress: () => saveProgress(dateString, 'not-followed'),
          style: 'default'
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date < today;
  };

  const getProgressStats = () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    let followed = 0;
    let partiallyFollowed = 0;
    let notFollowed = 0;
    let total = 0;
    
    Object.entries(progressData).forEach(([dateString, data]) => {
      const date = new Date(dateString);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        total++;
        switch (data.status) {
          case 'followed':
            followed++;
            break;
          case 'partially-followed':
            partiallyFollowed++;
            break;
          case 'not-followed':
            notFollowed++;
            break;
        }
      }
    });
    
    return { followed, partiallyFollowed, notFollowed, total };
  };

  const days = getDaysInMonth(currentDate);
  const stats = getProgressStats();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Progress Calendar</Text>
        <Text style={styles.subtitle}>Track your daily progress</Text>
      </View>

      {/* Month Navigation */}
      <View style={styles.monthNavigation}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigateMonth(-1)}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        
        <Text style={styles.monthText}>{getMonthName(currentDate)}</Text>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigateMonth(1)}
        >
          <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      <View style={styles.calendar}>
        {/* Week Days Header */}
        <View style={styles.weekHeader}>
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
            <Text key={day} style={styles.weekDay}>{day}</Text>
          ))}
        </View>

        {/* Calendar Days */}
        <View style={styles.daysContainer}>
          {days.map((date, index) => {
            const status = getDayStatus(date);
            const todayCheck = isToday(date);
            const pastDate = isPastDate(date);
            const dayColor = getDayColor(status, todayCheck, pastDate);
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  { backgroundColor: dayColor },
                  todayCheck && styles.todayBorder,
                ]}
                onPress={() => handleDayPress(date)}
                disabled={!date}
              >
                {date && (
                  <Text 
                    style={[
                      styles.dayText,
                      (status === 'followed' || status === 'not-followed' || status === 'partially-followed' || todayCheck) 
                        && styles.dayTextWhite
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legend:</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Followed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
            <Text style={styles.legendText}>Partial</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
            <Text style={styles.legendText}>Not Followed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: COLORS.primary }]} />
            <Text style={styles.legendText}>Today</Text>
          </View>
        </View>
      </View>

      {/* Monthly Stats */}
      {stats.total > 0 && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>This Month's Progress</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.followed}</Text>
              <Text style={styles.statLabel}>Followed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.partiallyFollowed}</Text>
              <Text style={styles.statLabel}>Partial</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.notFollowed}</Text>
              <Text style={styles.statLabel}>Missed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {Math.round(((stats.followed + stats.partiallyFollowed * 0.5) / stats.total) * 100)}%
              </Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </View>
      )}

      {/* Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Tips</Text>
        <Text style={styles.tipsText}>
          • Tap on today or past days to track your progress{'\n'}
          • Green = Followed your plan completely{'\n'}
          • Orange = Partially followed your plan{'\n'}
          • Red = Did not follow your plan{'\n'}
          • Consistency is key to achieving your health goals!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS_EXTENDED.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  navButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  calendar: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  weekDay: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.gray,
    width: DAY_SIZE,
    textAlign: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: DAY_SIZE / 2,
    backgroundColor: COLORS.white,
  },
  todayBorder: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  dayTextWhite: {
    color: COLORS.white,
  },
  legend: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  statsContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 5,
  },
  tipsContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    padding: 15,
    backgroundColor: COLORS_EXTENDED.lightBlue,
    borderRadius: 15,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
});

export default CalendarScreen;