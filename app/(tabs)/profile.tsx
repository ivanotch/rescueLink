import React, {useState} from "react";
import {View, Text, TouchableOpacity, Modal} from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";

export default function Profile() {
    const [modal, setModal] = useState(false);
    const router = useRouter();
    const auth = getAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace("/login"); // redirect to login page
        } catch (error: any) {
            alert(error.message);
        }
    };

  return (
    <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
            <View className="flex-row items-center justify-between border-b border-gray-300 p-4">
                <Text className="text-2xl font-semibold">Profile</Text>

                <TouchableOpacity
                    activeOpacity={0.6}
                    className="bg-red-700 px-4 py-2 rounded-lg flex-row gap-2 items-center justify-center"
                    onPress={() => setModal(true)}
                >
                    <Text className="text-white font-semibold">Log out</Text>
                </TouchableOpacity>
            </View>
            <Modal
            visible={modal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
                // resetForm();
                setModal(false);
            }}
            >
                <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }} className="justify-center items-center">
                    <View
                        className="bg-white flex-col justify-between p-4 rounded-2xl m-4"
                        style={{ width: "90%"}}
                    >
                        <View className="my-4">
                            <Text>Are you sure you want to log out?</Text>
                        </View>
                        <View className="flex-row justify-end gap-3">
                            <TouchableOpacity
                                onPress={() => {
                                    setModal(false)
                                }}
                                className="px-4 py-2 rounded-lg bg-gray-300"
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleLogout} className="px-4 py-2 rounded-lg bg-[#0F0D23]">
                                <Text className="text-white font-semibold" >Log out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    </SafeAreaProvider>
  );
}