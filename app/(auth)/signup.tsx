import React, { useState } from "react";
import {
    View,
    TextInput,
    Alert,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
} from "react-native";
import { setDoc, doc, updateDoc, GeoPoint } from "firebase/firestore";
import {createUserWithEmailAndPassword,} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import Animated, {useSharedValue, useAnimatedStyle, withTiming,} from "react-native-reanimated";
import { auth, db } from "@/services/firebaseConfig";
import { useRouter, Href } from "expo-router";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from '@expo/vector-icons/Ionicons'
import * as ImagePicker from "expo-image-picker";
import MapPicker from "@/components/MapPicker";

const { width } = Dimensions.get("window");

export default function Signup() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [barangay, setBarangay] = useState("");
    const [municipality, setMunicipality] = useState("");
    const [region, setRegion] = useState("");
    const [street, setStreet] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    const [mapVisible, setMapVisible] = useState(false);

    const [step, setStep] = useState(1);
    const translateX = useSharedValue(0);

    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassError, setConfirmPassError] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [houseNumberError, setHouseNumberError] = useState("");
    const [barangayError, setBarangayError] = useState("");
    const [municipalityError, setMunicipalityError] = useState("");
    const [regionError, setRegionError] = useState("");
    const [streetError, setStreetError] = useState("");
    const [zipcodeError, setZipcodeError] = useState("");
    const [locationError, setLocationError] = useState("");

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedImageError, setSelectedImageError] = useState("");

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const slideTo = (nextStep: number) => {
        setStep(nextStep);
        translateX.value = withTiming(-(nextStep - 1) * width, { duration: 400 });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const handleSignup = async () => {
        let valid = true;

        setEmailError("");
        setPasswordError("");
        setConfirmPassError("");

        if (!validateEmail(email)) {
            setEmailError("Please Enter a valid email");
            valid = false;
        }

        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters long.");
            valid = false;
        }

        if (password !== confirmPass) {
            setConfirmPassError("Passwords do not match.");
            valid = false;
        }

        if (!valid) return;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "persons", userCredential.user.uid), {
                profileCompletionStep: 1,
            }, { merge: true });
            console.log("User created:", userCredential.user.uid);
            slideTo(2);
        } catch (error: any) {
            Alert.alert("Signup failed", error.message);
        }
    };

    const handlePhoneChange = (input: string) => {
        let digits = input.replace(/\D/g, "");
        if (digits.startsWith("0")) digits = digits.substring(1);
        if (digits.length > 10) digits = digits.substring(0, 10);
        setPhoneNumber(digits);
    };

    const handleSubmitInfo = async () => {
        let valid = true;

        if (!phoneNumber) {
            setPhoneNumberError("Phone number is required");
            valid = false;
        }

        if (phoneNumber.length < 10) {
            setPhoneNumberError("Invalid Phone Number");
            valid = false;
        }

        if (!name) {
            setNameError("Name is required");
            valid = false;
        }

        if (!valid) return;

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                Alert.alert("Error", "No user logged in.");
                return;
            }

            const userRef = doc(db, "persons", currentUser.uid);
            await updateDoc(userRef, {
                name: name,
                phoneNumber: phoneNumber,
                email: email,
                profileCompletionStep: 2,
                isValidated: false,
            })

            slideTo(3)
        } catch (error: any) {
            console.error("Error updating user info:", error);
            Alert.alert("Error", "Failed to save information. Please try again.");
        }
    }

    const handleSubmitAddress = async () => {
        let valid = true;
        if (!houseNumber) {
            setHouseNumberError("House number is required");
            valid = false;
        }
        if (!street) {
            setStreetError("Street is required");
            valid = false;
        }
        if (!zipcode) {
            setZipcodeError("Zipcode is required");
            valid = false;
        }
        if (!barangay) {
            setBarangayError("Barangay is required");
            valid = false;
        }
        if (!region) {
            setRegionError("Region is required");
            valid = false;
        }
        if (!municipality) {
            setMunicipalityError("Municipality is required");
            valid = false;
        }
        if (!location) {
            setLocationError("Pin Address is Required")
            valid = false;
        }

        if (!valid) return;

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                Alert.alert("Error", "No user logged in.");
                return;
            }
            const userRef = doc(db, "persons", currentUser.uid);
            await updateDoc(userRef, {
                profileCompletionStep: 3,
                address: {
                    houseNo: houseNumber,
                    street: street,
                    barangay: barangay,
                    municipality: municipality,
                    region: region,
                    zipcode: zipcode,
                    location: new GeoPoint(location!.latitude, location!.longitude)
                }
            })
            slideTo(4);
        } catch (error: any) {
            console.error("Error updating user info:", error);
            Alert.alert("Error", "Failed to save information. Please try again.");
        }
    }

    const handleReturn = () => {
        if (step > 1) slideTo(step - 1);
        else router.back();
    };



    // Pick from gallery
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission required", "Please allow access to your photos.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true, // enable cropping
            aspect: [4, 3], // you can adjust ID ratio
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission required", "Please allow access to your camera.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: "images",
            allowsEditing: true, // allow cropping when taking photo
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleSubmitID = async () => {
        if (!selectedImage) {
            Alert.alert("Missing ID", "Please upload or take a photo of your ID.");
            return;
        }

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                Alert.alert("Error", "No user logged in.");
                return;
            }

            const storage = getStorage();
            const imageRef = ref(storage, `ids/${currentUser.uid}.jpg`)
            const response = await fetch(selectedImage);
            const blob = await response.blob();
            await uploadBytes(imageRef, blob);

            const downloadURL = await getDownloadURL(imageRef);

            const userRef = doc(db, "persons", currentUser.uid);
            await updateDoc(userRef, {
                isValidated: true,
                validIdUrl: downloadURL,
                profileCompletionStep: 4,
            })

            router.replace('/(tabs)' as Href)
        } catch (error: any) {
            console.error("Error updating user info:", error);
            Alert.alert("Error", "Failed to save information. Please try again.");
        }

    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1}} className="items-center justify-center">
                <View className="flex-col items-center w-full">
                    <View style={{width, overflow: "hidden"}}>
                        <Animated.View
                            style={[
                                animatedStyle,
                                {flexDirection: "row", width: width * 4},
                            ]}
                        >
                            {/* Step 1 */}
                            <View style={{flex: 1, padding: 20}} className="flex-col items-center">
                                <View className="flex-col items-center w-full space-y-1 mb-6">
                                    <Text style={{fontSize: 32, fontWeight: "bold"}}>Sign up</Text>
                                    <Text style={{fontSize: 12, fontWeight: "bold"}}>
                                        Already have an account?{" "}
                                        <Text style={{color: "blue"}} onPress={() => router.replace("/login")}>
                                            Login
                                        </Text>
                                    </Text>
                                </View>
                                {/* Email input */}
                                <View style={{marginBottom: 10}}>
                                    <View
                                        className="bg-gray-200 rounded-lg py-1 flex-row items-center"
                                        style={{paddingHorizontal: 5, width: "90%"}}
                                    >
                                        <Fontisto name="email" size={24} color="black" style={{marginHorizontal: 4}}/>
                                        <TextInput
                                            placeholder="Email"
                                            value={email}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            onChangeText={(text) => {
                                                setEmail(text);
                                                if (emailError) setEmailError("");
                                            }}
                                            className="w-full"
                                        />
                                    </View>
                                    {emailError ? <Text style={{color: "red", fontSize: 12}}>{emailError}</Text> : null}
                                </View>
                                {/* Password input */}
                                <View style={{marginBottom: 10}}>
                                    <View
                                        className="bg-gray-200 rounded-lg py-1 flex-row items-center"
                                        style={{paddingHorizontal: 5, width: "90%"}}
                                    >
                                        <AntDesign name="lock" size={24} color="black" style={{marginHorizontal: 4}}/>
                                        <TextInput
                                            placeholder="Password"
                                            value={password}
                                            secureTextEntry
                                            onChangeText={(text) => {
                                                setPassword(text);
                                                if (passwordError) setPasswordError("");
                                            }}
                                            className="w-full"
                                        />
                                    </View>
                                    {passwordError ?
                                        <Text style={{color: "red", fontSize: 12}}>{passwordError}</Text> : null}
                                </View>
                                {/* Confirm password input */}
                                <View style={{marginBottom: 10}}>
                                    <View
                                        className="bg-gray-200 rounded-lg py-1 flex-row items-center"
                                        style={{paddingHorizontal: 5, width: "90%"}}
                                    >
                                        <AntDesign name="lock" size={24} color="black" style={{marginHorizontal: 4}}/>
                                        <TextInput
                                            placeholder="Confirm Password"
                                            value={confirmPass}
                                            secureTextEntry
                                            onChangeText={(text) => {
                                                setConfirmPass(text);
                                                if (confirmPassError) setConfirmPassError("");
                                            }}
                                            className="w-full"
                                        />
                                    </View>
                                    {confirmPassError ?
                                        <Text style={{color: "red", fontSize: 12}}>{confirmPassError}</Text> : null}
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

                            {/* Step 2 - Personal Information */}
                            <View style={{flex: 1, padding: 20}}>
                                <View style={{flexDirection: "row", alignItems: "center", marginBottom: 20}}>
                                    <TouchableOpacity onPress={handleReturn} style={{marginRight: 10}}>
                                        <Ionicons name="chevron-back-circle-outline" size={24} color="black"/>
                                    </TouchableOpacity>
                                    <View>
                                        <Text style={{fontSize: 24, fontWeight: "bold"}}>Personal Information</Text>
                                        <Text style={{fontSize: 14}}>Add your correct personal name and number</Text>
                                    </View>
                                </View>

                                <View
                                    className="bg-gray-200 rounded-lg py-1 flex-row items-center"
                                >
                                    <Ionicons name="person-outline" size={24} color="black"
                                              style={{marginHorizontal: 4}}/>
                                    <TextInput
                                        placeholder="Full name"
                                        value={name}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        onChangeText={(text) => {
                                            setName(text);
                                            if (nameError) setNameError("");
                                        }}
                                        className="w-full"
                                    />
                                </View>
                                {nameError ? <Text style={{color: "red"}}>{nameError}</Text> : null}

                                <View className="bg-gray-200 rounded-lg py-1 flex-row items-center"
                                      style={{marginTop: 10}}>
                                    <Feather name="phone" size={24} color="black" style={{marginHorizontal: 4}}/>
                                    <Text>+63</Text>
                                    <TextInput
                                        placeholder="Phone Number"
                                        value={phoneNumber}
                                        keyboardType="phone-pad"
                                        onChangeText={(text) => {
                                            handlePhoneChange(text);
                                            if (phoneNumberError) setPhoneNumberError("");
                                        }}
                                    />
                                </View>
                                {phoneNumberError ? <Text style={{color: "red"}}>{phoneNumberError}</Text> : null}

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{
                                        width: "100%",
                                        height: 50,
                                        backgroundColor: "#1E90FF",
                                        borderRadius: 8,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: 15,
                                        marginBottom: 20,
                                    }}
                                    onPress={handleSubmitInfo}
                                >
                                    <Text className="text-white text-lg font-bold">Next</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Step 3 - Address */}
                            <View style={{flex: 1, padding: 20}}>
                                <View style={{flexDirection: "row", alignItems: "center", marginBottom: 10}}>
                                    <TouchableOpacity onPress={handleReturn} style={{marginRight: 10}}>
                                        <Ionicons name="chevron-back-circle-outline" size={24} color="black"/>
                                    </TouchableOpacity>
                                    <View>
                                        <Text style={{fontSize: 24, fontWeight: "bold"}}>Address</Text>
                                        <Text style={{fontSize: 14}}>Add your correct home address</Text>
                                    </View>
                                </View>

                                <View className="flex-row justify-between">
                                    <View style={{width: "48%"}}>
                                        <View
                                            className="bg-gray-200 rounded-lg py-1 flex-row items-center"
                                            style={{paddingHorizontal: 5}}
                                        >
                                            <TextInput
                                                placeholder="House Number"
                                                value={houseNumber}
                                                autoCapitalize="none"
                                                keyboardType="email-address"
                                                onChangeText={(text) => {
                                                    setHouseNumber(text);
                                                    if (houseNumberError) setHouseNumberError("");
                                                }}
                                                className="w-full"
                                            />
                                        </View>
                                        {houseNumberError ?
                                            <Text style={{color: "red", fontSize: 12}}>{houseNumberError}</Text> : null}
                                    </View>
                                    <View style={{width: "48%"}}>
                                        <View
                                            className="bg-gray-200 rounded-lg py-1 flex-row items-center"
                                            style={{paddingHorizontal: 5}}
                                        >
                                            <TextInput
                                                placeholder="Street"
                                                value={street}
                                                autoCapitalize="none"
                                                keyboardType="email-address"
                                                onChangeText={(text) => {
                                                    setStreet(text);
                                                    if (streetError) setStreetError("");
                                                }}
                                                className="w-full"
                                            />
                                        </View>
                                        {streetError ?
                                            <Text style={{color: "red", fontSize: 12}}>{streetError}</Text> : null}
                                    </View>
                                </View>

                                <View style={{marginTop: 10}}>
                                    <View
                                        className="bg-gray-200 rounded-lg py-1 flex-row items-center"
                                        style={{paddingHorizontal: 5}}
                                    >
                                        <TextInput
                                            placeholder="Barangay"
                                            value={barangay}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            onChangeText={(text) => {
                                                setBarangay(text);
                                                if (barangayError) setBarangayError("");
                                            }}
                                            className="w-full"
                                        />
                                    </View>
                                    {barangayError ?
                                        <Text style={{color: "red", fontSize: 12}}>{barangayError}</Text> : null}
                                </View>

                                <View style={{marginVertical: 10}}>
                                    <View
                                        className="bg-gray-200 rounded-lg py-1 flex-row items-center"
                                        style={{paddingHorizontal: 5}}
                                    >
                                        <TextInput
                                            placeholder="Municipality"
                                            value={municipality}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            onChangeText={(text) => {
                                                setMunicipality(text);
                                                if (municipalityError) setMunicipalityError("");
                                            }}
                                            className="w-full"
                                        />
                                    </View>
                                    {municipalityError ?
                                        <Text style={{color: "red", fontSize: 12}}>{municipalityError}</Text> : null}
                                </View>

                                <View className="flex-row justify-between">
                                    <View style={{width: "48%"}}>
                                        <View
                                            className="bg-gray-200 rounded-lg py-1 flex-row items-center"
                                            style={{paddingHorizontal: 5}}
                                        >
                                            <TextInput
                                                placeholder="Region"
                                                value={region}
                                                autoCapitalize="none"
                                                keyboardType="email-address"
                                                onChangeText={(text) => {
                                                    setRegion(text);
                                                    if (regionError) setRegionError("");
                                                }}
                                                className="w-full"
                                            />
                                        </View>
                                        {regionError ?
                                            <Text style={{color: "red", fontSize: 12}}>{regionError}</Text> : null}
                                    </View>
                                    <View style={{width: "48%"}}>
                                        <View
                                            className="bg-gray-200 rounded-lg py-1 flex-row items-center"
                                            style={{paddingHorizontal: 5}}
                                        >
                                            <TextInput
                                                placeholder="Zipcode"
                                                value={zipcode}
                                                autoCapitalize="none"
                                                keyboardType="email-address"
                                                onChangeText={(text) => {
                                                    setZipcode(text);
                                                    if (zipcodeError) setZipcodeError("");
                                                }}
                                                className="w-full"
                                            />
                                        </View>
                                        {zipcodeError ?
                                            <Text style={{color: "red", fontSize: 12}}>{zipcodeError}</Text> : null}
                                    </View>
                                </View>


                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{
                                        width: "100%",
                                        height: 45,
                                        borderRadius: 12,
                                        backgroundColor: "#2563EB", // Tailwind blue-600
                                        marginTop: 12,
                                        marginBottom: 16,
                                        flexDirection: "row",
                                        overflow: "hidden", // clean corners
                                    }}
                                    onPress={() => setMapVisible(true)}
                                >
                                    {/* Left side - Pin Button */}
                                    <View
                                        style={{
                                            width: "40%",
                                            backgroundColor: "#1D4ED8", // darker blue
                                            justifyContent: "center",
                                            alignItems: "center",
                                            flexDirection: "row",
                                            paddingHorizontal: 8,
                                        }}
                                    >
                                        <Feather name="map-pin" size={18} color="white" style={{marginRight: 5}}/>
                                        <Text style={{color: "white", fontWeight: "bold", fontSize: 14}}>
                                            Pin Location
                                        </Text>
                                    </View>

                                    {/* Right side - Placeholder */}
                                    <View
                                        style={{
                                            width: "60%",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            paddingHorizontal: 6,
                                        }}
                                    >
                                        <Text style={{color: "white", fontSize: 13, textAlign: "center"}}>
                                            Pinned Address: {location?.latitude.toFixed(3)}, {location?.longitude.toFixed(3)}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                {locationError ? <Text style={{color: "red", fontSize: 12}}>{zipcodeError}</Text> : null}

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{
                                        width: "100%",
                                        height: 50,
                                        backgroundColor: "#1E90FF",
                                        borderRadius: 8,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: 15,
                                        marginBottom: 20,
                                    }}
                                    onPress={handleSubmitAddress}
                                >
                                    <Text className="text-white text-lg font-bold">Next</Text>
                                </TouchableOpacity>
                            </View>

                            <MapPicker visible={mapVisible} onClose={() => setMapVisible(false)} onLocationSelect={(loc) => setLocation(loc)}/>

                            {/* Step 4 - Valid Id */}
                            <View style={{flex: 1, padding: 20}}>
                                {/* Header */}
                                <View style={{flexDirection: "row", alignItems: "center", marginBottom: 20}}>
                                    <TouchableOpacity onPress={handleReturn} style={{marginRight: 5}}>
                                        <Ionicons name="chevron-back-circle-outline" size={28} color="black"/>
                                    </TouchableOpacity>
                                    <View>
                                        <Text style={{fontSize: 24, fontWeight: "bold"}}>Submit Identification</Text>
                                        <Text style={{fontSize: 14}}>Submit your valid ID for verification</Text>
                                    </View>
                                </View>

                                {/* Upload Button */}
                                <TouchableOpacity
                                    onPress={pickImage}
                                    style={{
                                        height: 150,
                                        borderWidth: 2,
                                        borderColor: "#1E90FF",
                                        borderRadius: 10,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "#f9f9f9",
                                        marginBottom: 10,
                                    }}
                                >
                                    {selectedImage ? (
                                        <Image
                                            source={{uri: selectedImage}}
                                            style={{width: "100%", height: "100%", borderRadius: 8}}
                                            resizeMode="contain"
                                        />
                                    ) : (
                                        <Text style={{color: "#1E90FF", fontWeight: "bold"}}>+ Upload ID Photo</Text>
                                    )}
                                </TouchableOpacity>

                                {/* Take Photo Button */}
                                <TouchableOpacity
                                    onPress={takePhoto}
                                    style={{
                                        height: 50,
                                        backgroundColor: "#FFD700",
                                        borderRadius: 8,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: 20,
                                    }}
                                >
                                    <Text style={{fontWeight: "bold", fontSize: 16}}>📷 Take a Photo</Text>
                                </TouchableOpacity>

                                {/* Submit Button */}
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{
                                        width: "100%",
                                        height: 50,
                                        backgroundColor: "#1E90FF",
                                        borderRadius: 8,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                    onPress={handleSubmitID}
                                >
                                    <Text style={{color: "white", fontSize: 18, fontWeight: "bold"}}>Finish</Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
