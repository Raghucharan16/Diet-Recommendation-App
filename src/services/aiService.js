import axios from 'axios';
import { HF_TOKEN, API_URL, MODEL_NAME } from '@env';
import { calculateBMR, calculateTDEE, calculateMacros } from '../utils/calculations';

// Get environment variables
const apiUrl = API_URL || 'https://router.huggingface.co/v1/chat/completions';
const hfToken = HF_TOKEN || 'your_huggingface_token_here';
const modelName = MODEL_NAME || 'Qwen/Qwen3-Next-80B-A3B-Instruct:together';

console.log('🔧 AI Service initialized');

// Generate Diet Plan with fallback
export async function generateDietPlan(userProfile) {
  console.log('🍽️ Generating diet plan...');
  
  const { age, gender, weight, height, exerciseLevel, healthGoal, dietaryPreference } = userProfile;
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, exerciseLevel);
  const macros = calculateMacros(tdee);
  
  const bmi = (weight / ((height/100) ** 2)).toFixed(1);
  const goalDesc = healthGoal === 'weight_loss' ? 'Weight Loss' : 
                   healthGoal === 'weight_gain' ? 'Weight Gain' :
                   healthGoal === 'muscle_gain' ? 'Muscle Gain' : 'Maintain Weight';
  
  const dietType = dietaryPreference?.toLowerCase() === 'vegan' ? 'plant-based' : 
                   dietaryPreference?.toLowerCase() === 'vegetarian' ? 'vegetarian' : 'balanced';
  
  const plan = `
    <h3>Health Summary</h3>
    <p><strong>BMI:</strong> ${bmi}</p>
    <p><strong>Daily Calories:</strong> ${Math.round(tdee)} for ${goalDesc}</p>
    <p><strong>Macros:</strong> ${macros.protein}g protein, ${macros.carbs}g carbs, ${macros.fat}g fat</p>
    
    <h3>Weekly ${dietType.charAt(0).toUpperCase() + dietType.slice(1)} Diet Plan</h3>
    <p><strong>Monday:</strong> Power Start</p>
    <ul>
      <li>Breakfast: Oatmeal with berries (300 cal)</li>
      <li>Lunch: Grilled ${dietType === 'plant-based' ? 'tofu' : 'chicken'} salad (400 cal)</li>
      <li>Dinner: ${dietType === 'plant-based' ? 'Lentil curry' : 'Salmon'} with quinoa (450 cal)</li>
    </ul>
    
    <p><strong>Tuesday-Sunday:</strong> Similar balanced meals</p>
    <p>💡 Drink 8-10 glasses of water daily</p>
  `;
  
  return {
    success: true,
    data: plan,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    macros,
    fallback: true
  };
}

// Generate Exercise Plan with fallback
export async function generateExercisePlan(userProfile) {
  console.log('💪 Generating exercise plan...');
  
  const { exerciseLevel, healthGoal } = userProfile;
  
  const goalDesc = healthGoal === 'weight_loss' ? 'Weight Loss' : 
                   healthGoal === 'weight_gain' ? 'Weight Gain' :
                   healthGoal === 'muscle_gain' ? 'Muscle Gain' : 'Maintain Weight';
  
  const plan = `
    <h3>Fitness Assessment</h3>
    <p><strong>Current Level:</strong> ${exerciseLevel}</p>
    <p><strong>Goal:</strong> ${goalDesc}</p>
    
    <h3>Weekly Exercise Plan</h3>
    <p><strong>Monday:</strong> Upper Body</p>
    <ul>
      <li>Push-ups - 3 sets of ${exerciseLevel === 'sedentary' ? '5-8' : '12-15'} reps</li>
      <li>Squats - 3 sets of ${exerciseLevel === 'sedentary' ? '8-10' : '15-20'} reps</li>
      <li>Plank - 3 sets of ${exerciseLevel === 'sedentary' ? '20' : '45'} seconds</li>
    </ul>
    
    <p><strong>Tuesday:</strong> Cardio</p>
    <ul>
      <li>Walking/Jogging - ${exerciseLevel === 'sedentary' ? '20' : '30'} minutes</li>
      <li>Jumping jacks - 3 sets of ${exerciseLevel === 'sedentary' ? '15' : '30'} reps</li>
    </ul>
    
    <p><strong>Wednesday:</strong> Rest/Stretching</p>
    <p><strong>Thursday:</strong> Lower Body</p>
    <p><strong>Friday:</strong> Full Body Circuit</p>
    <p><strong>Weekend:</strong> Active recovery</p>
    
    <p>💡 Always warm up before exercising</p>
    <p>💡 Stay hydrated</p>
  `;
  
  return {
    success: true,
    data: plan,
    fallback: true
  };
}

export default {
  generateDietPlan,
  generateExercisePlan
};
