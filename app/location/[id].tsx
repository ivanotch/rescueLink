import React, {useEffect, useState} from "react";
import {View, ActivityIndicator, Text, TouchableOpacity} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {subscribeToHelpRequestWithResponses} from "@/firebaseHandler/helpRequestHandler";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import TimelineStyle from "@/components/Timeline";
import Entypo from "@expo/vector-icons/Entypo";

export default function LocationDetails() {
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);

    const [requestDetails, setRequestDetails] = useState<any>(null);
    const [responses, setResponses] = useState<any[]>([]);

    useEffect(() => {
        if (!id) return;

        setLoading(true);

        const unsubscribe = subscribeToHelpRequestWithResponses(id as string, ({requestDetails, responses}) => {
            setRequestDetails(requestDetails);
            setResponses(responses);
            setLoading(false);
        });

        return () => unsubscribe();

    }, [id]);

    if (loading) {
        return(
            <SafeAreaProvider>
                <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </SafeAreaView>
            </SafeAreaProvider>
        )
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, padding: 10}}>
                <View className="flex-row items-center justify-between border-b border-gray-300 p-1 mb-5">
                    <Text className="text-2xl font-semibold text-center w-full">Requests&#39; Timeline</Text>
                </View>

                <View style={{flex: 1}}>
                    {/*<Text>LocationDetails</Text>*/}
                    {/*<Text>{id}</Text>*/}
                    <TimelineStyle requestDetails={requestDetails} responses={responses} />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
  );
}