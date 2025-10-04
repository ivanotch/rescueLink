import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, ActivityIndicator, Image, Modal} from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Octicons from '@expo/vector-icons/Octicons';

export default function Profile() {
    const [modal, setModal] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();
    const auth = getAuth();
    const [userData, setUserData] = useState<any>(null);
    const [userAddressLoading, setUserAddressLoading] = useState(true);
    const [userInfoLoading, setUserInfoLoading] = useState(true);

    const fetchImage = async () => {
        const user = auth.currentUser;
        setLoading(true);
        setError("");
        try {
            if (user) {
                const storage = getStorage();
                const imageRef = ref(storage, `ids/${user.uid}.jpg`);
                const url = await getDownloadURL(imageRef);
                setImageUrl(url);
            } else {
                setError("Failed to fetch image");
            }
        } catch (err) {
            console.error("Error fetching image:", err);
            setError("No image, something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const userInfo = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const db = getFirestore();
            const userRef = doc(db, "persons", user.uid); // assumes users/{uid}
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                if (userSnap.exists()) {
                    setUserData({
                        ...userSnap.data(),
                        email: user.email,
                    });
                }
                console.log(user.email)
            } else {
                console.log("No such user document!");
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
        } finally {
            setUserAddressLoading(false);
            setUserInfoLoading(false);
        }
    }

    useEffect(() => {
        fetchImage()
        userInfo()
    }, []);

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

            <View className="flex-row items-center gap-3 p-4">
                <Ionicons name="person-circle-outline" size={65} color="black" />
                {userInfoLoading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <View className="flex-col">
                        <Text className="font-semibold text-2xl">{userData.name}</Text>
                        <Text>63+ {userData.phoneNumber}</Text>
                        <Text>{userData.email}</Text>
                    </View>
                )}
            </View>

            <View style={{ padding: 5, borderWidth: 2, margin: 10, alignItems: "center", justifyContent: "center" }}>
                {loading ? (
                    <View style={{width: "100%", height: 250}} className="justify-center items-center p-5">
                        <ActivityIndicator size="large" />
                        <Text>Loading...</Text>
                    </View>
                ) : error ? (
                    <View style={{width: "100%", height: 250}} className="justify-center items-center p-5">
                        <FontAwesome6 name="sad-tear" size={24} color="black" />
                        <TouchableOpacity
                            onPress={fetchImage}
                        >
                            <Text style={{ color: "red" }}>{error}</Text>
                        </TouchableOpacity>
                    </View>
                ) : imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={{ width: "100%", height: 250, borderRadius: 10 }}
                        resizeMode="cover"
                    />
                ) : (
                    <Text>No image available</Text>
                )}
            </View>

            <View style={{marginTop: 15}}>
                <View style={{paddingVertical: 4, borderBottomWidth: 2, borderColor: '#3674B5', marginHorizontal: 5}} className="flex-row">
                    <Octicons name="home" size={30} color="black" />
                    <Text style={{fontSize: 20, padding: 5, marginLeft: 5}}>Address</Text>
                </View>
                {userAddressLoading ? (
                    <ActivityIndicator size="large" />
                    ) : (
                    <View style={{ marginHorizontal: 10, marginTop: 10, gap: 10 }}>
                        {/* Row 1 */}
                        <View className="flex-row justify-between">
                            <View style={{ padding: 5, borderRadius: 5, flex: 1, marginHorizontal: 2 }} className="bg-gray-200">
                                <Text style={{ fontSize: 11 }}>House No.</Text>
                                <Text style={{ fontSize: 15 }} className="font-semibold">
                                    {userData.address.houseNo}
                                </Text>
                            </View>
                            <View style={{ padding: 5, borderRadius: 5, flex: 1, marginHorizontal: 2 }} className="bg-gray-200">
                                <Text style={{ fontSize: 11 }}>Street</Text>
                                <Text style={{ fontSize: 15 }} className="font-semibold">
                                    {userData.address.street}
                                </Text>
                            </View>
                            <View style={{ padding: 5, borderRadius: 5, flex: 1, marginHorizontal: 2 }} className="bg-gray-200">
                                <Text style={{ fontSize: 11 }}>Barangay</Text>
                                <Text style={{ fontSize: 15 }} className="font-semibold">
                                    {userData.address.barangay}
                                </Text>
                            </View>
                        </View>
                        {/* Row 2 */}
                        <View className="flex-row justify-between">
                            <View style={{ padding: 5, borderRadius: 5, flex: 1, marginHorizontal: 2 }} className="bg-gray-200">
                                <Text style={{ fontSize: 11 }}>Municipality</Text>
                                <Text style={{ fontSize: 15 }} className="font-semibold">
                                    {userData.address.municipality}
                                </Text>
                            </View>
                            <View style={{ padding: 5, borderRadius: 5, flex: 1, marginHorizontal: 2 }} className="bg-gray-200">
                                <Text style={{ fontSize: 11 }}>Region</Text>
                                <Text style={{ fontSize: 15 }} className="font-semibold">
                                    {userData.address.region}
                                </Text>
                            </View>
                            <View style={{ padding: 5, borderRadius: 5, flex: 1, marginHorizontal: 2 }} className="bg-gray-200">
                                <Text style={{ fontSize: 11 }}>Zipcode</Text>
                                <Text style={{ fontSize: 15 }} className="font-semibold">
                                    {userData.address.zipcode}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
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