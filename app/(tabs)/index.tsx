import "../globals.css";
import {Text, View, ScrollView, KeyboardAvoidingView, Platform, Alert, Button, Image, TouchableOpacity, FlatList, Modal, TextInput, StyleSheet} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {useEffect, useState} from "react";
import Entypo from "@expo/vector-icons/Entypo";
import {HelpRequestWithId} from "@/types/helpRequestWithId";
import {listenToRequest, createHelpRequest} from "@/firebaseHandler/helpRequestHandler";
import {router} from "expo-router";
import MapPicker from "@/components/MapPicker";
import {getAuth} from "firebase/auth";

export default function Index() {

    //photo holder
    const [photo, setPhoto] = useState<string | null>(null);

    //modal info
    const [concern, setConcern] = useState("");
    const [description, setDescription] = useState("");
    const [urgency, setUrgency] = useState<"low" | "medium" | "high">("low");
    const urgencyLevels = ["low", "medium", "high"] as const;

    const [activeTab, setActiveTab] = useState<"humans" | "animals">("humans");
    const [requests, setRequests] = useState<HelpRequestWithId[]>([]);
    const [modal, setModal] = useState(false);

    //Map
    const [mapVisible, setMapVisible] = useState(false);
    const [pickedLocation, setPickedLocation] = useState<{ latitude: number; longitude: number; address?: string } | null>(null);

    useEffect(() => {
        const unsubscribe  = listenToRequest(setRequests);
        return () => unsubscribe();
    }, []);

    const filteredRequests = requests.filter((r) => r.types === activeTab);

    const getUrgencyColor = (level: string) => {
        switch (level) {
            case "high":
                return "text-red-600";
            case "medium":
                return "text-yellow-600";
            case "low":
                return "text-green-600";
            default:
                return "text-gray-600";
        }
    };

    const handleSubmit = async () => {
        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("No logged-in user");

            if (!concern.trim()) {
                alert("Please enter a concern.");
                return;
            }

            if (!description.trim()) {
                alert("Please enter a description.");
                return;
            }

            if (!pickedLocation) {
                alert("Please pick a location.");
                return;
            }
            await createHelpRequest({
                personId: currentUser.uid,
                concern,
                description,
                levelOfUrgency: urgency,
                helpStatus: "onGoing",
                types: activeTab, // "humans" or "animals"
                location: { latitude: pickedLocation.latitude, longitude: pickedLocation.longitude }, // later: from Location API
                photoUri: photo || undefined,
            });

            // Reset + Close
            resetForm();
            setModal(false);
        } catch (err) {
            console.error("Failed to save request:", err);
        }
    };

    const openCamera = async () => {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") return;

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: 'images',
            allowsEditing: false,
            quality: 1,
        })

        if (!result.canceled) setPhoto(result.assets[0].uri);
    }

    const openGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) setPhoto(result.assets[0].uri);
    };

    const openPickerDialog = () => {
        Alert.alert(
            "Upload Photo",
            "Choose an option",
            [
                { text: "Cancel", style: "cancel" },
                { text: "📷 Take Photo", onPress: openCamera },
                { text: "🖼️ Choose from Gallery", onPress: openGallery },
            ]
        );
    };

    const resetForm = () => {
        setConcern("");
        setDescription("");
        setUrgency("low");
        setPhoto(null);
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View className="flex-row items-center justify-between border-b border-gray-300 p-4">
                    <Text className="text-2xl font-semibold">Help Requests</Text>

                    <TouchableOpacity
                        activeOpacity={0.6}
                        className="bg-[#0F0D23] px-4 py-2 rounded-lg flex-row gap-2 items-center justify-center"
                        onPress={() => setModal(true)}
                    >
                        <Entypo name="plus" size={24} color="white" />
                        <Text className="text-white font-semibold">Add</Text>
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View className="flex-row bg-gray-300 rounded-xl m-4 p-1">
                    {/* Humans Tab */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setActiveTab("humans")}
                        className={`flex-1 p-3 rounded-xl items-center ${
                            activeTab === "humans" ? "bg-white" : "bg-gray-300"
                        }`}
                    >
                        <Text
                            className={`font-semibold ${
                                activeTab === "humans" ? "text-black" : "text-gray-600"
                            }`}
                        >
                            Humans
                        </Text>
                    </TouchableOpacity>

                    {/* Animals Tab */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            setActiveTab("animals")
                            console.log("animals")
                        }}
                        className={`flex-1 p-3 rounded-xl items-center ${
                            activeTab === "animals" ? "bg-white" : "bg-gray-300"
                        }`}
                    >
                        <Text
                            className={`font-semibold ${
                                activeTab === "animals" ? "text-black" : "text-gray-600"
                            }`}
                        >
                            Animals
                        </Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={filteredRequests}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            className="bg-white rounded-xl shadow p-4 mx-4 mb-3 flex-row justify-between items-center"
                            onPress={() => router.push(`/location/${item.id}`)}
                        >
                            <View>
                                <Text className="text-lg font-semibold">
                                    {item.concern}
                                </Text>
                                <Text className="text-gray-500 text-sm">
                                    {item.location.latitude.toFixed(3)}, {item.location.longitude.toFixed(3)}
                                </Text>
                            </View>
                            <Text className={`font-bold capitalize ${getUrgencyColor(item.levelOfUrgency.toLowerCase())}`}>
                                {item.levelOfUrgency}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
                <Modal
                    visible={modal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => {
                        resetForm();
                        setModal(false);
                    }}
                >
                    <View
                        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
                        className="justify-center items-center"
                    >
                        <View
                            className="bg-white flex-col justify-between p-4 rounded-2xl m-4"
                            style={{ width: "90%", height: "80%" }}
                        >
                            {/* 👇 Wrap form inside KeyboardAvoidingView + ScrollView */}
                            <KeyboardAvoidingView
                                behavior={Platform.OS === "ios" ? "padding" : undefined}
                                style={{ flex: 1 }}
                            >
                                <ScrollView
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {/* Title */}
                                    <View
                                        className="border-gray-300 mb-4"
                                        style={{ borderBottomWidth: 1 }}
                                    >
                                        <Text style={{ fontSize: 20, padding: 4 }} className="font-semibold">
                                            Add Help Request
                                        </Text>
                                    </View>

                                    {/* Concern */}
                                    <View style={styles.container}>
                                        <Text style={styles.label}>Concern:</Text>
                                        <TextInput
                                            placeholder="What's Your Request?"
                                            style={styles.input}
                                            value={concern}
                                            onChangeText={setConcern}
                                        />
                                    </View>

                                    {/* Description */}
                                    <View>
                                        <Text className="font-medium">Description</Text>
                                        <TextInput
                                            numberOfLines={4}
                                            placeholder="Add details"
                                            style={{
                                                borderWidth: 1,
                                                borderColor: "#D1D5DB",
                                                borderRadius: 8,
                                                padding: 8,
                                                marginBottom: 12,
                                                marginTop: 9,
                                                height: 100,
                                                textAlignVertical: "top",
                                            }}
                                            value={description}
                                            onChangeText={setDescription}
                                            multiline
                                        />
                                    </View>

                                    {/* Photo Upload */}
                                    <View className="my-5">
                                        <Button title="Upload Photo" onPress={openPickerDialog} />
                                        {photo && (
                                            <Image
                                                source={{ uri: photo }}
                                                style={{
                                                    width: "100%",
                                                    height: 200,
                                                    marginTop: 20,
                                                    borderRadius: 10,
                                                }}
                                            />
                                        )}
                                    </View>

                                    <View className="my-5">
                                        <Button title="📍 Share Location" onPress={() => setMapVisible(true)} />
                                        {pickedLocation && (
                                            <Text style={{ marginTop: 10 }}>
                                                Selected: {pickedLocation.address || `${pickedLocation.latitude.toFixed(3)}, ${pickedLocation.longitude.toFixed(3)}`}
                                            </Text>
                                        )}
                                    </View>

                                    <MapPicker
                                        visible={mapVisible}
                                        onClose={() => setMapVisible(false)}
                                        onLocationSelect={(loc) => setPickedLocation(loc)}
                                    />

                                    {/* Urgency */}
                                    <View className="flex-col gap-2">
                                        <Text className="font-medium">Urgency</Text>
                                        <View className="flex-row justify-around mb-4">
                                            {urgencyLevels.map((level) => (
                                                <TouchableOpacity
                                                    key={level}
                                                    activeOpacity={1}
                                                    onPress={() => setUrgency(level)}
                                                    className={`flex-1 items-center mx-1 py-2 rounded-lg ${
                                                        urgency === level ? "bg-[#0F0D23]" : "bg-gray-200"
                                                    }`}
                                                >
                                                    <Text
                                                        className={`capitalize ${
                                                            urgency === level ? "text-white" : "text-black"
                                                        }`}
                                                    >
                                                        {level}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                </ScrollView>
                            </KeyboardAvoidingView>

                            {/* Buttons stay pinned at the bottom */}
                            <View className="flex-row justify-end gap-3">
                                <TouchableOpacity
                                    onPress={() => {
                                        resetForm();
                                        setModal(false);
                                    }}
                                    className="px-4 py-2 rounded-lg bg-gray-300"
                                >
                                    <Text>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    className="px-4 py-2 rounded-lg bg-[#0F0D23]"
                                >
                                    <Text className="text-white font-semibold">Send Help</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center", // vertically centers label + input
        marginBottom: 12,
    },
    label: {
        width: 90, // fixed width for the label
        fontSize: 16,
    },
    input: {
        flex: 1, // takes remaining space
        height: 40,
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 6,
        paddingHorizontal: 10,
    },
});
