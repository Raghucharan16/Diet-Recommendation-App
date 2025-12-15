import axios from 'axios';
import Constants from 'expo-constants';
import { HF_TOKEN, API_URL, MODEL_NAME } from '@env';
import { calculateBMR, calculateTDEE, calculateMacros } from '../utils/calculations';

// Version marker to force cache invalidation
export const API_VERSION = '1.0.1';

// Get environment variables with fallbacks
const apiUrl = API_URL || 'https://router.huggingface.co/v1/chat/completions';
const hfToken = HF_TOKEN || 'your_huggingface_token_here';
const modelName = MODEL_NAME || 'Qwen/Qwen3-Next-80B-A3B-Instruct:together';

// Check if using Hugging Face Inference API format
const isInferenceAPI = modelName.includes('mistralai/') || modelName.includes('microsoft/');
const baseApiUrl = isInferenceAPI ? `https://api-inference.huggingface.co/models/${modelName}` : apiUrl;

const huggingfaceApi = axios.create({
  baseURL: baseApiUrl,
  timeout: 45000, // 45 seconds timeout
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

// Retry mechanism
const retryRequest = async (requestFn, maxRetries = 2) => {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries || !error.code || error.code !== 'ECONNABORTED') {
        throw error;
      }
      console.log(`Retry attempt ${i + 1}/${maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1))); // Exponential backoff
    }
  }
};

// Create API request payload based on model type
const createRequestPayload = (prompt, maxTokens = 1000) => {
  if (isInferenceAPI) {
    // Hugging Face Inference API format
    return {
      inputs: prompt,
      parameters: {
        max_new_tokens: maxTokens,
        temperature: 0.5,
        top_p: 0.9,
        return_full_text: false
      }
    };
  } else {
    // OpenAI-style chat completions format
    return {
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: modelName,
      max_tokens: maxTokens,
      temperature: 0.5,
      top_p: 0.9
    };
  }
};

// Generate Diet Plan
export const generateDietPlan = async (userProfile) => {
  console.log('🍽️ Starting diet plan generation...');
  const startTime = Date.now();
  
  // TEMPORARY: Use fallback system for reliable functionality
  // Uncomment the try-catch block below to enable API calls
  
  const { age, gender, weight, height, exerciseLevel, healthGoal, dietaryPreference } = userProfile;
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, exerciseLevel);
  const macros = calculateMacros(tdee);
  
  console.log('✅ Using enhanced fallback diet plan');
  
  const goalDescription = healthGoal === 'weight_loss' ? 'Weight Loss' : 
                         healthGoal === 'weight_gain' ? 'Weight Gain' :
                         healthGoal === 'muscle_gain' ? 'Muscle Gain' :
                         healthGoal === 'maintain' ? 'Maintain Weight' : 'General Health';
  
  const bmi = (weight / ((height/100) ** 2)).toFixed(1);
  let bmiStatus = '';
  if (bmi < 18.5) bmiStatus = 'underweight - focus on healthy weight gain';
  else if (bmi < 25) bmiStatus = 'normal weight - maintain current habits';
  else if (bmi < 30) bmiStatus = 'overweight - consider gradual weight loss';
  else bmiStatus = 'obese - consult healthcare provider for weight management';
  
  const dietType = dietaryPreference.toLowerCase() === 'vegan' ? 'plant-based' : 
                   dietaryPreference.toLowerCase() === 'vegetarian' ? 'vegetarian' : 'balanced';
  
  const fallbackPlan = `
    <h3>Health Summary</h3>
    <p><strong>BMI:</strong> ${bmi} (${bmiStatus})</p> 
    <p><strong>Daily Needs:</strong> ${Math.round(tdee)} calories for ${goalDescription.toLowerCase()}</p>
    <p><strong>Macronutrients:</strong> ${macros.protein}g protein, ${macros.carbs}g carbs, ${macros.fat}g fat</p>
    
    <h3>Weekly ${dietType.charAt(0).toUpperCase() + dietType.slice(1)} Diet Plan</h3>
    <p><strong>Monday:</strong> Power Start</p>
    <ul>
      <li>Breakfast: Oatmeal with berries and nuts (300 cal)</li>
      <li>Lunch: Grilled ${dietType === 'plant-based' ? 'tofu' : 'chicken'} salad (400 cal)</li>
      <li>Dinner: ${dietType === 'plant-based' ? 'Lentil curry' : 'Baked salmon'} with quinoa (450 cal)</li>
      <li>Snacks: Greek yogurt and fruit (200 cal)</li>
    </ul>
    
    <p><strong>Tuesday:</strong> Energy Boost</p>
    <ul>
      <li>Breakfast: Smoothie bowl with protein powder (350 cal)</li>
      <li>Lunch: ${dietType === 'plant-based' ? 'Chickpea' : 'Turkey'} wrap (420 cal)</li>
      <li>Dinner: Stir-fry vegetables with ${dietType === 'plant-based' ? 'tempeh' : 'lean beef'} (400 cal)</li>
      <li>Snacks: Almonds and apple (180 cal)</li>
    </ul>
    
    <p><strong>Wednesday:</strong> Midweek Balance</p>
    <ul>
      <li>Breakfast: Avocado toast with eggs (${dietType === 'vegan' ? 'Replace eggs with tomatoes' : ''}) (320 cal)</li>
      <li>Lunch: Buddha bowl with quinoa and vegetables (450 cal)</li>
      <li>Dinner: ${dietType === 'plant-based' ? 'Black bean tacos' : 'Grilled fish with sweet potato'} (420 cal)</li>
      <li>Snacks: Hummus with carrots (160 cal)</li>
    </ul>
    
    <p><strong>Thursday:</strong> Recovery Day</p>
    <ul>
      <li>Breakfast: Chia pudding with fruits (280 cal)</li>
      <li>Lunch: ${dietType === 'plant-based' ? 'Veggie burger' : 'Lean protein'} with salad (400 cal)</li>
      <li>Dinner: Vegetable soup with whole grain bread (380 cal)</li>
      <li>Snacks: Trail mix (220 cal)</li>
    </ul>
    
    <p><strong>Friday:</strong> Weekend Prep</p>
    <ul>
      <li>Breakfast: Protein pancakes with berries (340 cal)</li>
      <li>Lunch: ${dietType === 'plant-based' ? 'Quinoa salad' : 'Chicken Caesar salad'} (430 cal)</li>
      <li>Dinner: ${dietType === 'plant-based' ? 'Stuffed bell peppers' : 'Lean steak with vegetables'} (480 cal)</li>
      <li>Snacks: Dark chocolate and nuts (190 cal)</li>
    </ul>
    
    <p><strong>Saturday:</strong> Active Day</p>
    <ul>
      <li>Breakfast: Breakfast burrito (${dietType === 'vegan' ? 'with beans' : 'with eggs'}) (380 cal)</li>
      <li>Lunch: ${dietType === 'plant-based' ? 'Falafel bowl' : 'Grilled chicken bowl'} (460 cal)</li>
      <li>Dinner: Pasta with ${dietType === 'plant-based' ? 'marinara and vegetables' : 'lean meat sauce'} (440 cal)</li>
      <li>Snacks: Smoothie (170 cal)</li>
    </ul>
    
    <p><strong>Sunday:</strong> Rest & Prep</p>
    <ul>
      <li>Breakfast: French toast (${dietType === 'vegan' ? 'with plant milk' : ''}) (360 cal)</li>
      <li>Lunch: ${dietType === 'plant-based' ? 'Veggie sushi bowl' : 'Salmon poke bowl'} (420 cal)</li>
      <li>Dinner: Roasted vegetables with ${dietType === 'plant-based' ? 'chickpeas' : 'chicken thighs'} (460 cal)</li>
      <li>Snacks: Herbal tea and biscuits (140 cal)</li>
    </ul>
    
    <p><strong>💡 Tips:</strong></p>
    <ul>
      <li>Drink 8-10 glasses of water daily</li>
      <li>Adjust portions based on hunger and activity level</li>
      <li>Include 30 minutes of physical activity most days</li>
      <li>${dietType === 'plant-based' ? 'Consider B12 and iron supplementation' : 'Include variety in protein sources'}</li>
    </ul>
  `;
  
  return {
    success: true,
    data: fallbackPlan,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    macros,
    fallback: true
  };
  
  /*
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
    
    const prompt = `[INST] Create a 7-day diet plan for ${goalDescription}.

User profile: ${age}-year-old ${gender}, ${weight}kg, ${height}cm, ${exerciseLevel} activity level
Daily calorie target: ${Math.round(tdee)} calories
${dietaryPreference.toLowerCase() === 'vegan' ? 'Dietary preference: Vegan only' : ''}

Please provide the response in HTML format with:
1. Health summary with BMI calculation
2. 7-day meal plan (Monday to Sunday)
3. Each day should include breakfast, lunch, and dinner
4. Keep meals simple and practical

Format exactly like this:
<h3>Health Summary</h3>
<p>BMI: [calculate] - [brief recommendation]</p>
<h3>Weekly Diet Plan</h3>
<p><strong>Monday:</strong></p>
<ul><li>Breakfast: [meal]</li><li>Lunch: [meal]</li><li>Dinner: [meal]</li></ul>
[Continue for all 7 days] [/INST]`;

    console.log(`🤖 Using model: ${modelName}`);
    console.log(`📝 Prompt length: ${prompt.length} characters`);
    console.log(`🔧 API format: ${isInferenceAPI ? 'Hugging Face Inference' : 'OpenAI-style'}`);
    
    const requestPayload = createRequestPayload(prompt, 1000);
    const response = await retryRequest(() => 
      huggingfaceApi.post('', requestPayload)
    );

    let dietPlan;
    if (isInferenceAPI) {
      // Hugging Face Inference API response format
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        dietPlan = response.data[0].generated_text || response.data[0].text;
      } else if (response.data && response.data.generated_text) {
        dietPlan = response.data.generated_text;
      } else {
        throw new Error('Invalid response format from Hugging Face Inference API');
      }
    } else {
      // OpenAI-style response format
      if (response.data.choices && response.data.choices.length > 0) {
        dietPlan = response.data.choices[0].message.content;
      } else {
        throw new Error('Invalid response format from OpenAI-style API');
      }
    }

    const endTime = Date.now();
    console.log(`✅ Diet plan generated successfully in ${endTime - startTime}ms`);
    
    return {
      success: true,
      data: cleanResponse(dietPlan),
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      macros
    };
  } catch (error) {
    console.error('Error generating diet plan:', error);
    
    // Fallback: Return basic diet plan if API fails
    const { age, gender, weight, height, exerciseLevel, healthGoal, dietaryPreference } = userProfile;
    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, exerciseLevel);
    const macros = calculateMacros(tdee);
    
    const fallbackPlan = `
      <h3>Health Summary</h3>
      <p>BMI: ${(weight / ((height/100) ** 2)).toFixed(1)}. Based on your profile, you need ${Math.round(tdee)} calories daily for your ${healthGoal} goal.</p>
      
      <h3>Basic Diet Plan</h3>
      <p><strong>Daily Guidelines:</strong></p>
      <ul>
        <li>Calories: ${Math.round(tdee)}</li>
        <li>Protein: ${macros.protein}g</li>
        <li>Carbs: ${macros.carbs}g</li>
        <li>Fat: ${macros.fat}g</li>
      </ul>
      
      <p><strong>Sample Day:</strong></p>
      <ul>
        <li>Breakfast: Oatmeal with fruits</li>
        <li>Lunch: Grilled protein with vegetables</li>
        <li>Dinner: Lean protein with whole grains</li>
        <li>Snacks: Nuts, fruits, or yogurt</li>
      </ul>
      
      <p>Note: This is a basic plan. For detailed recommendations, please try again later.</p>
    `;
    
    return {
      success: true,
      data: fallbackPlan,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      macros,
      fallback: true
    };
  }
};

// Generate Exercise Plan
export const generateExercisePlan = async (userProfile) => {
  console.log('💪 Starting exercise plan generation...');
  
  // TEMPORARY: Use enhanced fallback system for reliable functionality
  const { exerciseLevel, healthGoal } = userProfile;
  
  console.log('✅ Using enhanced fallback exercise plan');
  
  const goalDescription = healthGoal === 'weight_loss' ? 'Weight Loss' : 
                         healthGoal === 'weight_gain' ? 'Weight Gain' :
                         healthGoal === 'muscle_gain' ? 'Muscle Gain' :
                         healthGoal === 'maintain' ? 'Maintain Weight' : 'General Health';
  
  const intensityLevel = exerciseLevel === 'sedentary' ? 'beginner' :
                        exerciseLevel === 'light' ? 'beginner-intermediate' :
                        exerciseLevel === 'moderate' ? 'intermediate' :
                        exerciseLevel === 'heavy' ? 'advanced' : 'intermediate';
  
  const fallbackPlan = `
    <h3>Fitness Assessment</h3>
    <p><strong>Current Level:</strong> ${exerciseLevel} activity level (${intensityLevel})</p>
    <p><strong>Primary Goal:</strong> ${goalDescription}</p>
    <p><strong>Recommendation:</strong> This plan is designed to progressively improve your fitness while supporting your ${goalDescription.toLowerCase()} goals.</p>
    
    <h3>Weekly Exercise Plan</h3>
    <p><strong>Monday:</strong> Upper Body Strength</p>
    <ul>
      <li>Push-ups (or knee push-ups) - 3 sets of ${exerciseLevel === 'sedentary' ? '5-8' : exerciseLevel === 'light' ? '8-12' : '12-15'} reps</li>
      <li>Bodyweight squats - 3 sets of ${exerciseLevel === 'sedentary' ? '8-10' : exerciseLevel === 'light' ? '10-15' : '15-20'} reps</li>
      <li>Plank hold - 3 sets of ${exerciseLevel === 'sedentary' ? '15-20' : exerciseLevel === 'light' ? '20-30' : '30-45'} seconds</li>
      <li>Wall push-ups - 2 sets of 10-12 reps</li>
    </ul>
    
    <p><strong>Tuesday:</strong> Cardiovascular Training</p>
    <ul>
      <li>Brisk walking/light jogging - ${exerciseLevel === 'sedentary' ? '15-20' : exerciseLevel === 'light' ? '20-25' : '25-30'} minutes</li>
      <li>Jumping jacks - 3 sets of ${exerciseLevel === 'sedentary' ? '10-15' : exerciseLevel === 'light' ? '15-20' : '20-30'} reps</li>
      <li>High knees - 3 sets of 20 seconds</li>
      <li>Cool-down stretching - 10 minutes</li>
    </ul>
    
    <p><strong>Wednesday:</strong> Active Recovery</p>
    <ul>
      <li>Gentle yoga or stretching - 20-30 minutes</li>
      <li>Light walking - 15-20 minutes</li>
      <li>Deep breathing exercises - 5-10 minutes</li>
      <li>Foam rolling (if available) - 10 minutes</li>
    </ul>
    
    <p><strong>Thursday:</strong> Lower Body Strength</p>
    <ul>
      <li>Bodyweight squats - 3 sets of ${exerciseLevel === 'sedentary' ? '8-12' : exerciseLevel === 'light' ? '12-15' : '15-20'} reps</li>
      <li>Lunges (each leg) - 3 sets of ${exerciseLevel === 'sedentary' ? '6-8' : exerciseLevel === 'light' ? '8-10' : '10-12'} reps</li>
      <li>Calf raises - 3 sets of ${exerciseLevel === 'sedentary' ? '10-15' : exerciseLevel === 'light' ? '15-20' : '20-25'} reps</li>
      <li>Glute bridges - 3 sets of 12-15 reps</li>
    </ul>
    
    <p><strong>Friday:</strong> Full Body Circuit</p>
    <ul>
      <li>Burpees (modified if needed) - 3 sets of ${exerciseLevel === 'sedentary' ? '3-5' : exerciseLevel === 'light' ? '5-8' : '8-10'} reps</li>
      <li>Mountain climbers - 3 sets of 20 seconds</li>
      <li>Sit-ups or crunches - 3 sets of ${exerciseLevel === 'sedentary' ? '8-12' : exerciseLevel === 'light' ? '12-15' : '15-20'} reps</li>
      <li>Side planks (each side) - 2 sets of 15-20 seconds</li>
    </ul>
    
    <p><strong>Saturday:</strong> Cardio & Fun</p>
    <ul>
      <li>Choose your favorite activity: dancing, cycling, swimming, or hiking</li>
      <li>Duration: ${exerciseLevel === 'sedentary' ? '20-30' : exerciseLevel === 'light' ? '30-40' : '40-60'} minutes</li>
      <li>Core strengthening - 10 minutes</li>
      <li>Flexibility exercises - 10 minutes</li>
    </ul>
    
    <p><strong>Sunday:</strong> Rest Day</p>
    <ul>
      <li>Complete rest or gentle movement</li>
      <li>Light stretching if desired - 10-15 minutes</li>
      <li>Prepare for the upcoming week</li>
      <li>Focus on recovery and nutrition</li>
    </ul>
    
    <p><strong>💡 Exercise Tips:</strong></p>
    <ul>
      <li>Always warm up for 5-10 minutes before exercising</li>
      <li>Listen to your body and rest when needed</li>
      <li>Gradually increase intensity and duration</li>
      <li>Stay hydrated throughout your workouts</li>
      <li>Focus on proper form over speed or intensity</li>
      <li>${healthGoal === 'weight_loss' ? 'Combine with a caloric deficit for best results' : healthGoal === 'muscle_gain' ? 'Ensure adequate protein intake for muscle growth' : 'Maintain consistency for long-term health benefits'}</li>
    </ul>
  `;
  
  return {
    success: true,
    data: fallbackPlan,
    fallback: true
  };
  
  /*
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

    const prompt = `[INST] Create a 7-day exercise plan for ${goalDescription}.

User profile: ${age}-year-old ${gender}, ${weight}kg, ${exerciseLevel} fitness level

Please provide the response in HTML format with:
1. Fitness assessment
2. 7-day exercise plan (Monday to Sunday)
3. Include different types of exercises
4. Include rest days
5. Specify reps/duration for each exercise

Format exactly like this:
<h3>Fitness Assessment</h3>
<p>[brief fitness assessment]</p>
<h3>Weekly Exercise Plan</h3>
<p><strong>Monday:</strong> [workout type]</p>
<ul><li>[Exercise] - [reps/duration]</li></ul>
[Continue for all 7 days] [/INST]`;

    console.log(`🤖 Using model: ${modelName}`);
    console.log(`📝 Prompt length: ${prompt.length} characters`);
    console.log(`🔧 API format: ${isInferenceAPI ? 'Hugging Face Inference' : 'OpenAI-style'}`);
    
    const requestPayload = createRequestPayload(prompt, 800);
    const response = await retryRequest(() =>
      huggingfaceApi.post('', requestPayload)
    );

    let exercisePlan;
    if (isInferenceAPI) {
      // Hugging Face Inference API response format
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        exercisePlan = response.data[0].generated_text || response.data[0].text;
      } else if (response.data && response.data.generated_text) {
        exercisePlan = response.data.generated_text;
      } else {
        throw new Error('Invalid response format from Hugging Face Inference API');
      }
    } else {
      // OpenAI-style response format
      if (response.data.choices && response.data.choices.length > 0) {
        exercisePlan = response.data.choices[0].message.content;
      } else {
        throw new Error('Invalid response format from OpenAI-style API');
      }
    }

    const endTime = Date.now();
    console.log(`✅ Exercise plan generated successfully in ${endTime - startTime}ms`);
    
    return {
      success: true,
      data: cleanResponse(exercisePlan)
    };
  } catch (error) {
    console.error('Error generating exercise plan:', error);
    
    // Fallback: Return basic exercise plan if API fails
    const { age, gender, weight, exerciseLevel, healthGoal } = userProfile;
    
    const fallbackPlan = `
      <h3>Fitness Assessment</h3>
      <p>Based on your ${exerciseLevel} activity level, here's a basic weekly routine for ${healthGoal}.</p>
      
      <h3>Basic Exercise Plan</h3>
      <p><strong>Monday:</strong> Upper Body</p>
      <ul>
        <li>Push-ups - 3 sets of 10-15</li>
        <li>Squats - 3 sets of 15-20</li>
        <li>Plank - 3 sets of 30 seconds</li>
      </ul>
      
      <p><strong>Tuesday:</strong> Cardio</p>
      <ul>
        <li>Walking/Jogging - 20-30 minutes</li>
        <li>Jumping jacks - 3 sets of 20</li>
      </ul>
      
      <p><strong>Wednesday:</strong> Rest Day</p>
      <ul><li>Light stretching or yoga</li></ul>
      
      <p><strong>Thursday:</strong> Full Body</p>
      <ul>
        <li>Bodyweight exercises - 20-30 minutes</li>
        <li>Core exercises - 10 minutes</li>
      </ul>
      
      <p><strong>Friday-Sunday:</strong> Active recovery and cardio</p>
      
      <p>Note: This is a basic plan. For detailed recommendations, please try again later.</p>
    `;
    
    return {
      success: true,
      data: fallbackPlan,
      fallback: true
    };
  }
  */
};

