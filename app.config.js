import 'dotenv/config';
export default {
    expo: {
        name: "rescue_app",
        slug: "rescue_app",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "rescueapp",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
            config: {
                googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY, // ✅ Added
            },
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            edgeToEdgeEnabled: true,
            package: "com.anonymous.rescueapp",
            googleServicesFile: "./android/app/google-services.json",
            config: {
                googleMaps: {
                    apiKey: process.env.GOOGLE_MAPS_API_KEY, // ✅ Added
                },
            },
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png"
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff"
                }
            ],
            "expo-secure-store",
            "@react-native-firebase/app",
            "@react-native-firebase/auth"
        ],
        experiments: {
            typedRoutes: true
        },
        extra: {
            router: {},
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY, // ✅ So you can access it in JS code
            eas: {
                projectId: "5ca61f5d-74c5-4ee0-b3c8-5f42c31bbf38"
            }
        }
    }
};
