// Medical condition-based dietary and exercise recommendations

export const MEDICAL_CONDITION_GUIDELINES = {
  none: {
    dietaryRestrictions: [],
    recommendedFoods: [],
    avoidFoods: [],
    exerciseModifications: [],
    specialNotes: []
  },
  
  diabetes_type1: {
    dietaryRestrictions: [
      'Monitor carbohydrate intake carefully',
      'Maintain consistent meal timing',
      'Balance carbs with insulin dosing'
    ],
    recommendedFoods: [
      'Complex carbohydrates (quinoa, brown rice, oats)',
      'High-fiber vegetables (broccoli, spinach, brussels sprouts)',
      'Lean proteins (chicken breast, fish, tofu)',
      'Healthy fats (avocado, nuts, olive oil)',
      'Low-glycemic fruits (berries, apples, pears)'
    ],
    avoidFoods: [
      'Simple sugars and refined carbs',
      'Sugary drinks and sodas',
      'Processed foods high in trans fats',
      'White bread and pastries',
      'High-sugar fruits (watermelon, pineapple)'
    ],
    exerciseModifications: [
      'Check blood glucose before, during, and after exercise',
      'Carry fast-acting carbs during workouts',
      'Avoid exercise if blood glucose is very high or low',
      'Start with moderate intensity and gradually increase'
    ],
    specialNotes: [
      'Work closely with healthcare team for insulin management',
      'Keep detailed food and blood sugar logs',
      'Stay hydrated and monitor for hypoglycemia'
    ]
  },

  diabetes_type2: {
    dietaryRestrictions: [
      'Limit refined carbohydrates and sugars',
      'Control portion sizes',
      'Focus on low glycemic index foods'
    ],
    recommendedFoods: [
      'Non-starchy vegetables (leafy greens, peppers, tomatoes)',
      'Whole grains (quinoa, brown rice, barley)',
      'Lean proteins (fish, poultry, legumes)',
      'Healthy fats (nuts, seeds, olive oil)',
      'Low-sugar fruits (berries, cherries, apples)'
    ],
    avoidFoods: [
      'Refined sugars and sweets',
      'White bread and white rice',
      'Sugary beverages',
      'Processed and fried foods',
      'High-fat dairy products'
    ],
    exerciseModifications: [
      'Aim for 150 minutes of moderate exercise per week',
      'Include both cardio and strength training',
      'Monitor blood sugar levels',
      'Exercise can help improve insulin sensitivity'
    ],
    specialNotes: [
      'Weight management is crucial',
      'Regular blood glucose monitoring',
      'Coordinate with healthcare provider for medication timing'
    ]
  },

  hypertension: {
    dietaryRestrictions: [
      'Limit sodium intake to less than 2300mg daily',
      'Reduce saturated and trans fats',
      'Limit alcohol consumption'
    ],
    recommendedFoods: [
      'Potassium-rich foods (bananas, potatoes, spinach)',
      'Whole grains and high-fiber foods',
      'Low-fat dairy products',
      'Lean proteins (fish, poultry, beans)',
      'Fresh fruits and vegetables'
    ],
    avoidFoods: [
      'High-sodium processed foods',
      'Canned soups and frozen meals',
      'Deli meats and cured meats',
      'Pickled and fermented foods',
      'Excessive caffeine'
    ],
    exerciseModifications: [
      'Regular aerobic exercise can lower blood pressure',
      'Start slowly and gradually increase intensity',
      'Avoid sudden intense movements',
      'Monitor blood pressure before and after exercise'
    ],
    specialNotes: [
      'DASH diet is highly recommended',
      'Regular blood pressure monitoring',
      'Stress management is important'
    ]
  },

  heart_disease: {
    dietaryRestrictions: [
      'Very low saturated fat and trans fat',
      'Limited cholesterol intake',
      'Controlled sodium intake'
    ],
    recommendedFoods: [
      'Omega-3 rich fish (salmon, mackerel, sardines)',
      'Whole grains and oats',
      'Nuts and seeds (walnuts, flaxseeds)',
      'Fruits and vegetables',
      'Lean proteins and legumes'
    ],
    avoidFoods: [
      'Red meat and processed meats',
      'Full-fat dairy products',
      'Fried and fast foods',
      'Foods high in trans fats',
      'Excessive salt and sugar'
    ],
    exerciseModifications: [
      'Exercise as prescribed by cardiologist',
      'Monitor heart rate during exercise',
      'Start with low-intensity activities',
      'Avoid exercising in extreme temperatures'
    ],
    specialNotes: [
      'Mediterranean diet is beneficial',
      'Regular cardiac check-ups',
      'Medication compliance is crucial'
    ]
  },

  high_cholesterol: {
    dietaryRestrictions: [
      'Limit saturated fats to less than 7% of calories',
      'Avoid trans fats completely',
      'Limit dietary cholesterol'
    ],
    recommendedFoods: [
      'Soluble fiber foods (oats, beans, apples)',
      'Fatty fish rich in omega-3s',
      'Nuts and seeds',
      'Plant sterols and stanols',
      'Olive oil and avocados'
    ],
    avoidFoods: [
      'High-fat meats and organ meats',
      'Full-fat dairy products',
      'Egg yolks (limit to 2-3 per week)',
      'Processed and fried foods',
      'Coconut and palm oils'
    ],
    exerciseModifications: [
      'Regular aerobic exercise helps raise HDL',
      'Include strength training 2-3 times per week',
      'Aim for 30 minutes of exercise daily',
      'Weight management supports cholesterol control'
    ],
    specialNotes: [
      'Regular lipid panel monitoring',
      'Portfolio diet can be effective',
      'Consider plant-based options'
    ]
  },

  thyroid: {
    dietaryRestrictions: [
      'Monitor iodine intake if on thyroid medication',
      'Timing of meals with medication is important',
      'Some foods may interfere with thyroid function'
    ],
    recommendedFoods: [
      'Iodine-rich foods (seaweed, dairy, eggs)',
      'Selenium-rich foods (Brazil nuts, fish)',
      'Zinc-rich foods (pumpkin seeds, chickpeas)',
      'Anti-inflammatory foods',
      'Whole, unprocessed foods'
    ],
    avoidFoods: [
      'Excessive soy products (may interfere with absorption)',
      'Cruciferous vegetables in large amounts (raw)',
      'Highly processed foods',
      'Excessive sugar and refined carbs'
    ],
    exerciseModifications: [
      'Exercise may need adjustment based on thyroid levels',
      'Listen to your body - fatigue is common',
      'Include both cardio and strength training',
      'Start slowly if newly diagnosed'
    ],
    specialNotes: [
      'Take thyroid medication on empty stomach',
      'Regular thyroid function monitoring',
      'Symptoms may affect exercise tolerance'
    ]
  },

  pcos: {
    dietaryRestrictions: [
      'Low glycemic index foods',
      'Anti-inflammatory diet',
      'Limited refined carbohydrates'
    ],
    recommendedFoods: [
      'High-fiber foods (vegetables, legumes)',
      'Lean proteins (fish, poultry, plant proteins)',
      'Healthy fats (omega-3 rich foods)',
      'Low-glycemic fruits (berries, apples)',
      'Anti-inflammatory spices (turmeric, cinnamon)'
    ],
    avoidFoods: [
      'Refined sugars and processed foods',
      'High glycemic index carbohydrates',
      'Trans fats and excessive saturated fats',
      'Sugary drinks and snacks',
      'Inflammatory foods'
    ],
    exerciseModifications: [
      'Regular exercise helps with insulin resistance',
      'Combine cardio with strength training',
      'High-intensity interval training can be beneficial',
      'Exercise helps regulate hormones'
    ],
    specialNotes: [
      'Weight management is important',
      'Insulin resistance is common',
      'Regular monitoring of metabolic markers'
    ]
  },

  celiac: {
    dietaryRestrictions: [
      'Strict gluten-free diet required',
      'Avoid cross-contamination',
      'Read all food labels carefully'
    ],
    recommendedFoods: [
      'Naturally gluten-free grains (rice, quinoa, millet)',
      'Fresh fruits and vegetables',
      'Lean meats and fish',
      'Dairy products (if tolerated)',
      'Certified gluten-free products'
    ],
    avoidFoods: [
      'Wheat, barley, rye, and their derivatives',
      'Many processed foods containing gluten',
      'Beer and malt beverages',
      'Soy sauce (unless gluten-free)',
      'Cross-contaminated oats'
    ],
    exerciseModifications: [
      'No specific exercise restrictions',
      'Ensure pre/post workout snacks are gluten-free',
      'Monitor energy levels during transition period',
      'Stay hydrated and maintain electrolyte balance'
    ],
    specialNotes: [
      'Complete gluten elimination is essential',
      'Regular follow-up with gastroenterologist',
      'May need vitamin/mineral supplementation'
    ]
  },

  lactose_intolerance: {
    dietaryRestrictions: [
      'Avoid or limit lactose-containing dairy',
      'Use lactase enzyme supplements if needed',
      'Check processed foods for hidden lactose'
    ],
    recommendedFoods: [
      'Lactose-free dairy alternatives',
      'Plant-based milks (almond, soy, oat)',
      'Aged cheeses (lower in lactose)',
      'Calcium-rich non-dairy foods (leafy greens, tofu)',
      'Probiotic foods may help digestion'
    ],
    avoidFoods: [
      'Milk and fresh dairy products',
      'Ice cream and milk-based desserts',
      'Some processed foods with lactose',
      'Cream-based soups and sauces',
      'Milk chocolate'
    ],
    exerciseModifications: [
      'No specific exercise restrictions',
      'Ensure adequate calcium intake for bone health',
      'Use lactose-free sports drinks if needed',
      'Monitor digestive comfort during exercise'
    ],
    specialNotes: [
      'Ensure adequate calcium and vitamin D intake',
      'Severity varies among individuals',
      'Lactase supplements can help with occasional dairy'
    ]
  },

  kidney_disease: {
    dietaryRestrictions: [
      'Limit protein intake as advised by nephrologist',
      'Control phosphorus and potassium intake',
      'Limit sodium intake'
    ],
    recommendedFoods: [
      'High-quality proteins in controlled amounts',
      'Low-potassium fruits (apples, berries, grapes)',
      'Low-phosphorus foods',
      'Controlled fluid intake',
      'Fresh, unprocessed foods'
    ],
    avoidFoods: [
      'High-potassium foods (bananas, oranges, potatoes)',
      'High-phosphorus foods (dairy, nuts, beans)',
      'Processed and canned foods',
      'Dark sodas and beer',
      'Excessive protein'
    ],
    exerciseModifications: [
      'Exercise as tolerated and approved by physician',
      'Monitor fluid balance',
      'Adjust intensity based on energy levels',
      'Regular monitoring of kidney function'
    ],
    specialNotes: [
      'Work closely with renal dietitian',
      'Regular kidney function monitoring',
      'Medication timing is crucial'
    ]
  },

  arthritis: {
    dietaryRestrictions: [
      'Anti-inflammatory diet focus',
      'Maintain healthy weight to reduce joint stress',
      'Limit inflammatory foods'
    ],
    recommendedFoods: [
      'Omega-3 rich fish (salmon, sardines)',
      'Anti-inflammatory foods (berries, leafy greens)',
      'Whole grains and legumes',
      'Nuts and seeds',
      'Colorful fruits and vegetables'
    ],
    avoidFoods: [
      'Processed and fried foods',
      'Refined sugars and carbohydrates',
      'Excessive omega-6 oils',
      'Trans fats',
      'Excessive alcohol'
    ],
    exerciseModifications: [
      'Low-impact exercises (swimming, cycling)',
      'Range of motion and flexibility exercises',
      'Strength training with proper form',
      'Avoid high-impact activities during flares'
    ],
    specialNotes: [
      'Weight management reduces joint stress',
      'Heat/cold therapy can complement exercise',
      'Regular rheumatology follow-up'
    ]
  },

  anemia: {
    dietaryRestrictions: [
      'Focus on iron absorption enhancement',
      'Combine iron-rich foods with vitamin C',
      'Avoid iron inhibitors with iron-rich meals'
    ],
    recommendedFoods: [
      'Iron-rich foods (lean red meat, poultry, fish)',
      'Plant-based iron sources (spinach, lentils, tofu)',
      'Vitamin C rich foods (citrus, bell peppers)',
      'Folate-rich foods (leafy greens, fortified grains)',
      'B12 sources (meat, dairy, fortified foods)'
    ],
    avoidFoods: [
      'Tea and coffee with iron-rich meals',
      'Calcium supplements with iron-rich meals',
      'Excessive fiber with iron sources',
      'Antacids during iron-rich meals'
    ],
    exerciseModifications: [
      'Start with low-intensity exercise',
      'Gradually increase as iron levels improve',
      'Monitor for fatigue and shortness of breath',
      'Rest when needed and listen to your body'
    ],
    specialNotes: [
      'Regular blood work to monitor iron levels',
      'May need iron supplementation',
      'Address underlying cause of anemia'
    ]
  }
};

export const getDietaryRecommendations = (medicalCondition, userProfile) => {
  const guidelines = MEDICAL_CONDITION_GUIDELINES[medicalCondition] || MEDICAL_CONDITION_GUIDELINES.none;
  
  return {
    condition: medicalCondition,
    dietaryRestrictions: guidelines.dietaryRestrictions,
    recommendedFoods: guidelines.recommendedFoods,
    avoidFoods: guidelines.avoidFoods,
    specialNotes: guidelines.specialNotes,
    userProfile
  };
};

export const getExerciseRecommendations = (medicalCondition, userProfile) => {
  const guidelines = MEDICAL_CONDITION_GUIDELINES[medicalCondition] || MEDICAL_CONDITION_GUIDELINES.none;
  
  return {
    condition: medicalCondition,
    exerciseModifications: guidelines.exerciseModifications,
    specialNotes: guidelines.specialNotes,
    userProfile
  };
};

export const getMedicalConditionName = (conditionValue) => {
  const conditionMap = {
    'none': 'No Medical Conditions',
    'diabetes_type1': 'Type 1 Diabetes',
    'diabetes_type2': 'Type 2 Diabetes',
    'hypertension': 'High Blood Pressure',
    'heart_disease': 'Heart Disease',
    'high_cholesterol': 'High Cholesterol',
    'thyroid': 'Thyroid Disorders',
    'pcos': 'PCOS',
    'celiac': 'Celiac Disease',
    'lactose_intolerance': 'Lactose Intolerance',
    'food_allergies': 'Food Allergies',
    'kidney_disease': 'Kidney Disease',
    'liver_disease': 'Liver Disease',
    'arthritis': 'Arthritis',
    'osteoporosis': 'Osteoporosis',
    'anemia': 'Anemia'
  };
  
  return conditionMap[conditionValue] || 'Unknown Condition';
};