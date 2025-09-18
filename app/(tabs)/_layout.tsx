import React from "react";
import {View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {Tabs} from "expo-router";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function _Layout() {

    const TabIcons = ({ focused, label }: { focused: boolean; label: string }) => {
        let icon;

        if (label === "Home") {
            icon = (
                <MaterialIcons
                    name="emergency-share"
                    size={focused ? 24 : 22}
                    color={focused ? "black" : "slategray"}
                />
            );
        } else if (label === "Find") {
            icon = <FontAwesome6 name="person-shelter" size={24} color={focused ? "black" : "slategray"} />;
        } else if (label === "Relief") {
            icon = (
                <FontAwesome5
                    name="hands-helping"
                    size={focused ? 24 : 22}
                    color={focused ? "black" : "slategray"}
                />
            );
        } else if (label === "Profile") {
            icon = (
                <AntDesign name="user" size={focused ? 24 : 22} color={focused ? "black" : "slategray"} />
            );
        } else if (label === "Emergency") {
            icon = (
                <MaterialCommunityIcons
                    name="car-emergency"
                    size={focused ? 24 : 22}
                    color={focused ? "black" : "slategray"}
                />
            );
        } else {
            icon = (
                <Ionicons
                    name="help-circle"
                    size={focused ? 24 : 22}
                    color={focused ? "black" : "slategray"}
                />
            );
        }

        if (focused) {
            return (
                <View className="mt-4 items-center justify-center">
                    <LinearGradient
                        colors={["#D6C7FF", "#AB8BFF"]} // 👈 your gradient colors
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            minHeight: 48,
                            minWidth: 97,
                            borderRadius: 999,
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 8,
                            paddingHorizontal: 16, // extra spacing inside
                            flexDirection: "column",
                        }}
                    >
                        {icon}
                        <Text style={{ color: "black", fontSize: 11, marginTop: 2, marginRight: 6}}>
                            {label}
                        </Text>
                    </LinearGradient>
                </View>
            );
        }

        return (
            <View className="size-full justify-center items-center mt-4 rounded-full">
                {icon}
            </View>
        );
    };

    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                tabBarStyle: {
                    backgroundColor: '#0f0D23',
                    borderRadius: 50,
                    marginHorizontal: 10,
                    marginBottom: 36,
                    height: 52,
                    position: "absolute",
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: '#0f0D23'
                }
            }}
        >
        <Tabs.Screen
        name="index"
        options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
                <TabIcons focused={focused} label="Home" />
            )
        }}
        />
        <Tabs.Screen
        name="find"
        options={{
            title: "Find",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
                <TabIcons focused={focused} label="Find" />
            )
        }}/>
        <Tabs.Screen
            name="relief"
            options={{
                title: "Relief",
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcons focused={focused} label="Relief" />
                )
            }}/>
        <Tabs.Screen
            name="profile"
            options={{
                title: "Profile",
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcons focused={focused} label="Profile" />
                )
            }}/>
        <Tabs.Screen
            name="emergency"
            options={{
                title: "Emergency",
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcons focused={focused} label="Emergency" />
                )
            }}/>
    </Tabs>
    );
}
