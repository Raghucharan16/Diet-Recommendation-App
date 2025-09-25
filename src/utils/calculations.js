// BMR Calculation using Mifflin-St Jeor Equation
export const calculateBMR = (weight, height, age, gender) => {
  const baseMetabolism = 10 * weight + 6.25 * height - 5 * age;
  
  if (gender.toLowerCase() === 'male') {
    return baseMetabolism + 5;
  } else {
    return baseMetabolism - 161;
  }
};

// TDEE Calculation
export const calculateTDEE = (bmr, exerciseLevel) => {
  const activityLevels = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'heavy': 1.725,
    'very_heavy': 1.9
  };
  
  const factor = activityLevels[exerciseLevel.toLowerCase()] || 1.2;
  return bmr * factor;
};

// Macronutrient Distribution
export const calculateMacros = (tdee) => {
  return {
    carbs: Math.round((tdee * 0.5) / 4), // 50% carbs, 4 cal/g
    protein: Math.round((tdee * 0.2) / 4), // 20% protein, 4 cal/g
    fat: Math.round((tdee * 0.3) / 9) // 30% fat, 9 cal/g
  };
};

// BMI Calculation
export const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

// BMI Category
export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};
