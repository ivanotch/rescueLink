import "./globals.css";
import { Href, Stack, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

export default function RootLayout() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [nextRoute, setNextRoute] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setUser(null);
                setNextRoute("/login");
                setLoading(false);
                return;
            }

            setUser(firebaseUser);

            try {
                const userDoc = await getDoc(doc(db, "persons", firebaseUser.uid));

                if (userDoc.exists()) {
                    const data = userDoc.data();
                    const step = data?.profileCompletionStep ?? 1;

                    if (step < 5) {
                        // still mid-signup → keep them inside signup flow
                        setNextRoute("/(auth)/signup");
                    } else {
                        // finished → go to app
                        setNextRoute("/(tabs)");
                    }
                } else {
                    // no profile yet → start signup
                    setNextRoute("/(auth)/signup");
                }


            } catch (error) {
                console.error("Error fetching user profile:", error);
                setNextRoute("/login");
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // 🚀 Handle navigation *after* loading finishes
    useEffect(() => {
        if (!loading && nextRoute) {
            router.replace(nextRoute as Href);
        }
    }, [loading, nextRoute]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="location/[id]" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                </Stack>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}
