import React, { useState } from "react";
import {View, TextInput, Button, Alert, Text, TouchableOpacity} from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/services/firebaseConfig";
import { useRouter, Href } from "expo-router";

export default function Signup() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleSignup = async () => {
        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCred.user, {
                displayName: phoneNumber, // storing phone number temporarily
            });
            Alert.alert("Success", "Account created. Please log in.");
            router.replace("/login" as Href);
        } catch (err: any) {
            Alert.alert("Error", err.message);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, marginBottom: 10 }} />
            <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} style={{ borderWidth: 1, marginBottom: 10 }} />
            <TextInput placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} style={{ borderWidth: 1, marginBottom: 10 }} />
            <TouchableOpacity className="w-full text-center mb-5" onPress={() => router.replace('/login')}>
                <Text >Already Have an Account?</Text>
            </TouchableOpacity>
            <Button title="Sign Up" onPress={handleSignup} />
        </View>
    );
}
