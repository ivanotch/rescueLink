import React, { useState } from "react";
import { View, TextInput, Button, Alert, Text, TouchableOpacity } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const auth = getAuth();

        try {
            const trimmedEmail = email.trim(); // remove spaces
            if (!trimmedEmail) {
                alert("Please enter your email");
                return;
            }

            if (!password) {
                alert("Please enter your password");
                return;
            }

            await signInWithEmailAndPassword(auth, trimmedEmail, password);
            router.replace("/(tabs)");
        } catch (error: any) {
            alert(error.code + " " + error.message);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }} className="flex-col items-center justify-center w-full">
                    <View className="flex-col items-center w-full space-y-1">
                        <Text style={{ fontSize: 32, fontWeight: "bold" }}>
                            Login
                        </Text>

                        <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                            Don&apos;t have an account?{" "}
                            <Text
                                style={{ color: "blue" }}
                                onPress={() => router.replace("/signup")}
                            >
                                Sign up
                            </Text>
                        </Text>
                    </View>
                    <View style={{ padding: 20 }} className="w-[80%]">

                        <View className="bg-gray-200 rounded-lg py-1 flex-row items-center w-full" style={{ marginBottom: 10, paddingHorizontal: 5}}>
                            <Fontisto name="email" size={24} color="black" style={{marginHorizontal: 4}}/>
                            <TextInput placeholder="Email" value={email} onChangeText={setEmail} className="w-full" />
                        </View>

                        <View className="bg-gray-200 rounded-lg py-1 flex-row items-center w-full" style={{ marginBottom: 10, paddingHorizontal: 5}}>
                            <AntDesign name="lock" size={24} color="black" style={{marginHorizontal: 4}}/>
                            <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} className="w-full" />
                        </View>

                        <TouchableOpacity className="w-full mb-5" onPress={() => router.replace('/signup')}>
                            <Text className="w-full text-center" >Forgot Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.2}
                            style={{width: '100%', height: 50, backgroundColor: "#1E90FF", borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 20}}
                            onPress={handleLogin}
                        >
                            <Text className="text-white text-lg font-bold">Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
