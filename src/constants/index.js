export const COLORS = {
  primary: '#4A90E2',
  secondary: '#7ED321',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  lightGray: '#F2F2F7',
  darkGray: '#3A3A3C',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};

export const SIZES = {
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  padding: 16,
  margin: 16,
  borderRadius: 8,
};

export const ACTIVITY_LEVELS = [
  { label: 'Sedentary (little or no exercise)', value: 'sedentary' },
  { label: 'Light (light exercise 1-3 days/week)', value: 'light' },
  { label: 'Moderate (moderate exercise 3-5 days/week)', value: 'moderate' },
  { label: 'Heavy (heavy exercise 6-7 days/week)', value: 'heavy' },
  { label: 'Very Heavy (very heavy exercise, physical job)', value: 'very_heavy' },
];

export const HEALTH_GOALS = [
  { label: 'Weight Loss', value: 'weight_loss' },
  { label: 'Weight Gain', value: 'weight_gain' },
  { label: 'Muscle Gain', value: 'muscle_gain' },
  { label: 'Maintain Weight', value: 'maintain' },
  { label: 'General Health', value: 'general_health' },
];

export const DIETARY_PREFERENCES = [
  { label: 'Vegan', value: 'vegan' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Non-Vegetarian', value: 'non-vegetarian' },
];

export const GENDERS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

export const MEDICAL_CONDITIONS = [
  { label: 'None', value: 'none' },
  { label: 'Diabetes Type 1', value: 'diabetes_type1' },
  { label: 'Diabetes Type 2', value: 'diabetes_type2' },
  { label: 'High Blood Pressure (Hypertension)', value: 'hypertension' },
  { label: 'Heart Disease', value: 'heart_disease' },
  { label: 'High Cholesterol', value: 'high_cholesterol' },
  { label: 'Thyroid Disorders', value: 'thyroid' },
  { label: 'PCOS (Polycystic Ovary Syndrome)', value: 'pcos' },
  { label: 'Celiac Disease', value: 'celiac' },
  { label: 'Lactose Intolerance', value: 'lactose_intolerance' },
  { label: 'Food Allergies', value: 'food_allergies' },
  { label: 'Kidney Disease', value: 'kidney_disease' },
  { label: 'Liver Disease', value: 'liver_disease' },
  { label: 'Arthritis', value: 'arthritis' },
  { label: 'Osteoporosis', value: 'osteoporosis' },
  { label: 'Anemia', value: 'anemia' },
];

export const COLORS_EXTENDED = {
  ...COLORS,
  background: '#F8F9FA',
  lightBlue: '#E3F2FD',
  lightGreen: '#E8F5E8',
  lightRed: '#FFEBEE',
  lightOrange: '#FFF3E0',
};
