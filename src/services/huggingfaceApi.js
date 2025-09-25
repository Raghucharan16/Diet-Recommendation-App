import axios from 'axios';
import Constants from 'expo-constants';
import { HF_TOKEN, API_URL, MODEL_NAME } from '@env';
import { calculateBMR, calculateTDEE, calculateMacros } from '../utils/calculations';

// Get environment variables with fallbacks
const apiUrl = API_URL || 'https://router.huggingface.co/v1/chat/completions';
const hfToken = HF_TOKEN || 'your_huggingface_token_here';
const modelName = MODEL_NAME || 'Qwen/Qwen3-Next-80B-A3B-Instruct:together';

const huggingfaceApi = axios.create({
  baseURL: apiUrl,
  headers: {
    'Authorization': `Bearer ${hfToken}`,
    'Content-Type': 'application/json',
  },
});

// Clean response text (same as in your original code)
const cleanResponse = (text) => {
  if (!text) return text;
  
  const casualPhrases = [
    'Absolutely!', 'Hey there', 'Great question', 'Of course!', 
    'Sure thing', 'No problem', 'Definitely', 'For sure',
    'Totally', 'Amazing', 'Awesome', 'Perfect', 'Excellent question'
  ];
  
  let cleanedText = text;
  casualPhrases.forEach(phrase => {
    const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedPhrase}\\b[!,.]?\\s*`, 'gi');
    cleanedText = cleanedText.replace(regex, '');
  });
  
  // Remove exclamation marks at the beginning of sentences
  cleanedText = cleanedText.replace(/^\s*!+\s*/, '');
  cleanedText = cleanedText.replace(/\n\s*!+\s*/, '\n');
  
  // Ensure professional medical tone
  if (cleanedText && !cleanedText.trim().match(/^(Based on|According to|Your|As a|Given)/)) {
    cleanedText = 'Based on your health profile, ' + cleanedText.trim();
  }
  
  return cleanedText.trim();
};

// Generate Diet Plan
export const generateDietPlan = async (userProfile) => {
  try {
    // Check if HF_TOKEN is set
    if (!hfToken || hfToken === 'your_huggingface_token_here') {
      return {
        success: false,
        error: 'HuggingFace API token is not configured. Please set HF_TOKEN in your .env file.'
      };
    }

    const { age, gender, weight, height, exerciseLevel, healthGoal, dietaryPreference } = userProfile;
    
    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, exerciseLevel);
    const macros = calculateMacros(tdee);
    
    const goalDescription = healthGoal === 'weight_loss' ? 'Weight Loss' : 
                           healthGoal === 'weight_gain' ? 'Weight Gain' :
                           healthGoal === 'muscle_gain' ? 'Muscle Gain' :
                           healthGoal === 'maintain' ? 'Maintain Weight' : 'General Health';
    
    const prompt = `Create a 7-day diet plan for ${goalDescription} for a ${age}-year-old ${gender} (${weight}kg, ${height}cm, ${exerciseLevel} activity, maintain the tone in second person as you are suggesting).

Target: ${Math.round(tdee)} calories daily | Macros: ${macros.carbs}g carbs, ${macros.protein}g protein, ${macros.fat}g fat
${dietaryPreference.toLowerCase() === 'vegan' ? 'Note: Vegan options only' : ''}

Format exactly as HTML:

<h3>Health Summary</h3>
<p>BMI: [calculate and state]. [Brief recommendation in 2-3 sentences]</p>

<h3>Weekly Diet Plan</h3>
<p><strong>Monday:</strong></p>
<ul>
<li>Breakfast: [meal]</li>
<li>Lunch: [meal]</li>
<li>Dinner: [meal]</li>
<li>Snack: [snack]</li>
</ul>

<p><strong>Tuesday:</strong></p>
<ul>
<li>Breakfast: [meal]</li>
<li>Lunch: [meal]</li>
<li>Dinner: [meal]</li>
<li>Snack: [snack]</li>
</ul>

[Continue for Wednesday through Sunday with same format]

Keep meals simple and practical.`;

    const response = await huggingfaceApi.post('', {
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: modelName,
      max_tokens: 2400,
      temperature: 0.7
    });

    if (response.data.choices && response.data.choices.length > 0) {
      const dietPlan = response.data.choices[0].message.content;
      return {
        success: true,
        data: cleanResponse(dietPlan),
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        macros
      };
    } else {
      throw new Error('Invalid response format from API');
    }
  } catch (error) {
    console.error('Error generating diet plan:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to generate diet plan'
    };
  }
};

// Generate Exercise Plan
export const generateExercisePlan = async (userProfile) => {
  try {
    // Check if HF_TOKEN is set
    if (!hfToken || hfToken === 'your_huggingface_token_here') {
      return {
        success: false,
        error: 'HuggingFace API token is not configured. Please set HF_TOKEN in your .env file.'
      };
    }

    const { age, gender, weight, height, exerciseLevel, healthGoal } = userProfile;
    
    const goalDescription = healthGoal === 'weight_loss' ? 'Weight Loss' : 
                           healthGoal === 'weight_gain' ? 'Weight Gain' :
                           healthGoal === 'muscle_gain' ? 'Muscle Gain' :
                           healthGoal === 'maintain' ? 'Maintain Weight' : 'General Health';

    const prompt = `Create a 7-day exercise plan for ${goalDescription} for a ${age}-year-old ${gender} (${weight}kg, ${height}cm, ${exerciseLevel} fitness level, maintain the tone in second person as you are suggesting).

Format exactly as HTML:
        
<h3>Fitness Assessment</h3>
<p>[Brief fitness level assessment in 2-3 sentences]</p>

<h3>Weekly Exercise Plan</h3>
<p><strong>Monday:</strong> [Focus: e.g., Upper Body]</p>
<ul>
<li>[Exercise 1] - [reps/duration]</li>
<li>[Exercise 2] - [reps/duration]</li>
<li>[Exercise 3] - [reps/duration]</li>
<li>[Exercise 4] - [reps/duration]</li>
</ul>

<p><strong>Tuesday:</strong> [Focus: e.g., Cardio]</p>
<ul>
<li>[Exercise 1] - [reps/duration]</li>
<li>[Exercise 2] - [reps/duration]</li>
<li>[Exercise 3] - [reps/duration]</li>
<li>[Exercise 4] - [reps/duration]</li>
</ul>

[Continue for Wednesday through Sunday with same format]

Include rest days. Keep exercises simple and achievable.`;

    const response = await huggingfaceApi.post('', {
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: modelName,
      max_tokens: 2000,
      temperature: 0.7
    });

    if (response.data.choices && response.data.choices.length > 0) {
      const exercisePlan = response.data.choices[0].message.content;
      return {
        success: true,
        data: cleanResponse(exercisePlan)
      };
    } else {
      throw new Error('Invalid response format from API');
    }
  } catch (error) {
    console.error('Error generating exercise plan:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to generate exercise plan'
    };
  }
};
