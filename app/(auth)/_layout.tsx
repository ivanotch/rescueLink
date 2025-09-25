import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen options={{headerShown: false}} name="login" />
            <Stack.Screen name="signup" />
        </Stack>
    );
}
