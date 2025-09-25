# Diet Recommendation React Native App

A personalized diet and exercise recommendation mobile app built with React Native and Expo SDK 51. This app provides AI-powered recommendations using HuggingFace's language models to generate customized 7-day diet and exercise plans based on user profiles.

## Features

- **User Registration & Authentication**: Simple username/password authentication with local storage
- **Profile Setup**: Comprehensive health profile including age, gender, weight, height, dietary preferences, health goals, and exercise levels
- **AI-Powered Recommendations**: Personalized 7-day diet and exercise plans generated using HuggingFace API
- **BMR/TDEE Calculations**: Automatic calculation of Basal Metabolic Rate and Total Daily Energy Expenditure
- **Macro Nutrient Distribution**: Personalized carbohydrate, protein, and fat recommendations
- **Push Notifications**: Daily meal and exercise reminders
- **Offline Storage**: User data stored locally with AsyncStorage
- **Responsive Design**: Clean, modern UI optimized for mobile devices

## Technology Stack

- **Framework**: React Native with Expo SDK 51
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **Storage**: AsyncStorage for user data
- **API**: HuggingFace Transformers API
- **Notifications**: Expo Notifications
- **UI Components**: React Native Elements with custom styling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- HuggingFace API Token
- Mobile device with Expo Go app or iOS/Android simulator

## Installation & Setup

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd DietRecommendationApp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Open the `.env` file in the root directory
   - Replace `your_huggingface_token_here` with your actual HuggingFace API token:
   ```
   HF_TOKEN=your_actual_huggingface_token_here
   API_URL=https://router.huggingface.co/v1/chat/completions
   MODEL_NAME=Qwen/Qwen3-Next-80B-A3B-Instruct:together
   ```

4. **Get HuggingFace API Token**:
   - Visit [HuggingFace](https://huggingface.co/)
   - Create an account or sign in
   - Go to Settings → Access Tokens
   - Create a new token with read permissions
   - Copy the token to your `.env` file

## Running the App

1. **Start the Expo development server**:
   ```bash
   npm start
   ```

2. **Run on device/simulator**:
   - **Physical Device**: Install Expo Go app and scan the QR code
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal

## App Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # App screens
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── ProfileSetupScreen.js
│   ├── HomeScreen.js
│   ├── DietPlanScreen.js
│   ├── ExercisePlanScreen.js
│   └── SettingsScreen.js
├── services/           # API and external service integrations
│   ├── huggingfaceApi.js
│   └── notificationService.js
├── context/           # Global state management
│   └── AppContext.js
├── utils/             # Helper functions
│   ├── calculations.js
│   └── storage.js
├── constants/         # App constants and theme
│   └── index.js
└── navigation/        # Navigation configuration
    └── AppNavigator.js
```

## Usage Instructions

1. **Registration**: Create a new account with username and password
2. **Profile Setup**: Complete your health profile with:
   - Age, gender, weight, height
   - Dietary preferences (vegan, vegetarian, non-vegetarian)
   - Health goals (weight loss, weight gain, muscle gain, etc.)
   - Exercise level (sedentary to very active)
3. **Generate Recommendations**: Tap "Generate Recommendations" to get AI-powered plans
4. **View Plans**: Access your personalized diet and exercise plans from the tab navigation
5. **Notifications**: Enable meal and exercise reminders in settings

## Health Calculations

The app uses the **Mifflin-St Jeor Equation** for BMR calculation:
- **Men**: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
- **Women**: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161

TDEE is calculated by multiplying BMR with activity factors:
- Sedentary: BMR × 1.2
- Light activity: BMR × 1.375
- Moderate activity: BMR × 1.55
- Heavy activity: BMR × 1.725
- Very heavy activity: BMR × 1.9

## Customization

### Adding New Features
- New screens can be added to `src/screens/`
- Update navigation in `src/navigation/AppNavigator.js`
- Add new API endpoints in `src/services/`

### Styling
- Global colors and sizes are defined in `src/constants/index.js`
- Each screen has its own StyleSheet for component-specific styling

### Notifications
- Meal reminders: 8 AM, 1 PM, 7 PM, 9 PM
- Exercise reminders: 5 PM daily
- Customize times in `src/services/notificationService.js`

## Troubleshooting

### Common Issues

1. **API Token Error**: Ensure your HuggingFace token is correctly set in `.env`
2. **Network Issues**: Check internet connectivity for API calls
3. **Notification Permissions**: Allow notifications when prompted
4. **Build Errors**: Clear cache with `expo r -c`

### Performance Tips

- Recommendations are cached locally to reduce API calls
- Pull-to-refresh regenerates plans when needed
- User data is persisted locally for offline access

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

This project is for educational and personal use.

## Support

For issues or questions related to the original FastAPI application, refer to the source project. For React Native app-specific issues, check the Expo documentation or React Native guides.

---

**Note**: Remember to replace the placeholder HuggingFace token with your actual token before running the app!