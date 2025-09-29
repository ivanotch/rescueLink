import React, { useState, useEffect } from "react";
import {
    View,
    TextInput,
    Alert,
    Text,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import {
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import {
    SafeAreaProvider,
    SafeAreaView,
} from "react-native-safe-area-context";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import { auth } from "@/services/firebaseConfig";
import { useRouter, Href } from "expo-router";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

const { width } = Dimensions.get("window");

export default function Signup() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    // stage 2
    const [otp, setOtp] = useState("");
    const [verificationId, setVerificationId] = useState<string | null>(null);

    // stage 3
    const [websiteUrl, setWebsiteUrl] = useState("");

    const [step, setStep] = useState(1);
    const translateX = useSharedValue(0);

    const slideTo = (nextStep: number) => {
        setStep(nextStep);
        translateX.value = withTiming(-(nextStep - 1) * width, {
            duration: 400,
        });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const handleSignup = async () => {
        // Firebase signup skipped for now
        slideTo(2);
    };

    const sendOtp = async () => {
        // Firebase OTP skipped for now
        Alert.alert("OTP Sent", "Please check your phone");
    };

    const confirmOtp = async () => {
        slideTo(3);
    };

    const handleSubmitUrl = () => {
        const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
        if (!urlRegex.test(websiteUrl)) {
            Alert.alert("Error", "Please enter a valid URL");
            return;
        }
        Alert.alert("Success", "Account setup complete!");
        router.replace("/login" as Href);
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <View
                    style={{ flex: 1 }}
                    className="flex-col items-center justify-center w-full"
                >
                    <View className="flex-col items-center w-full space-y-1">
                        <Text style={{ fontSize: 32, fontWeight: "bold" }}>Sign up</Text>
                        <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                            Already have an account?{" "}
                            <Text
                                style={{ color: "blue" }}
                                onPress={() => router.replace("/login")}
                            >
                                Login
                            </Text>
                        </Text>
                    </View>

                    {/* Wrapper to clip extra steps */}
                    <View style={{ flex: 1, width, overflow: "hidden" }}>
                        <Animated.View
                            style={[
                                animatedStyle,
                                { flexDirection: "row", width: width * 3, flex: 1 },
                            ]}
                        >
                            {/* Step 1 */}
                            <View style={{ flex: 1, padding: 20 }}>
                                <View
                                    className="bg-gray-200 rounded-lg py-1 flex-row items-center w-full"
                                    style={{ marginBottom: 10, paddingHorizontal: 5 }}
                                >
                                    <Fontisto
                                        name="email"
                                        size={24}
                                        color="black"
                                        style={{ marginHorizontal: 4 }}
                                    />
                                    <TextInput
                                        placeholder="Email"
                                        value={email}
                                        onChangeText={setEmail}
                                        className="w-full"
                                    />
                                </View>

                                <View
                                    className="bg-gray-200 rounded-lg py-1 flex-row items-center w-full"
                                    style={{ marginBottom: 10, paddingHorizontal: 5 }}
                                >
                                    <AntDesign
                                        name="lock"
                                        size={24}
                                        color="black"
                                        style={{ marginHorizontal: 4 }}
                                    />
                                    <TextInput
                                        placeholder="Password"
                                        value={password}
                                        secureTextEntry
                                        onChangeText={setPassword}
                                        className="w-full"
                                    />
                                </View>

                                <View
                                    className="bg-gray-200 rounded-lg py-1 flex-row items-center w-full"
                                    style={{ marginBottom: 10, paddingHorizontal: 5 }}
                                >
                                    <AntDesign
                                        name="lock"
                                        size={24}
                                        color="black"
                                        style={{ marginHorizontal: 4 }}
                                    />
                                    <TextInput
                                        placeholder="Confirm Password"
                                        value={confirmPass}
                                        secureTextEntry
                                        onChangeText={setConfirmPass}
                                        className="w-full"
                                    />
                                </View>

                                <View
                                    className="bg-gray-200 rounded-lg py-1 flex-row items-center w-full"
                                    style={{ marginBottom: 10, paddingHorizontal: 5 }}
                                >
                                    <Feather
                                        name="phone"
                                        size={24}
                                        color="black"
                                        style={{ marginHorizontal: 4 }}
                                    />
                                    <TextInput
                                        placeholder="Phone Number"
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                        className="w-full"
                                    />
                                </View>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{
                                        width: "100%",
                                        height: 50,
                                        backgroundColor: "#1E90FF",
                                        borderRadius: 8,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: 20,
                                    }}
                                    onPress={handleSignup}
                                >
                                    <Text className="text-white text-lg font-bold">Continue</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Step 2 */}
                            <View style={{ flex: 1, padding: 20 }}>
                                <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                                    Verify Phone
                                </Text>
                                <TextInput
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChangeText={setOtp}
                                />
                                <TouchableOpacity onPress={sendOtp}>
                                    <Text>Send OTP</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={confirmOtp}>
                                    <Text>Confirm OTP</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Step 3 */}
                            <View style={{ flex: 1, padding: 20 }}>
                                <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                                    Final Step
                                </Text>
                                <TextInput
                                    placeholder="Enter your website URL"
                                    value={websiteUrl}
                                    onChangeText={setWebsiteUrl}
                                />
                                <TouchableOpacity onPress={handleSubmitUrl}>
                                    <Text>Finish</Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
