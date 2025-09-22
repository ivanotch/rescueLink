import React, {useEffect, useState} from "react";
import { View, Text, ActivityIndicator } from "react-native";
import {useLocalSearchParams} from "expo-router";
import {subscribeToHelpRequestWithResponses} from "@/firebaseHandler/helpRequestHandler";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import TimelineStyle from "@/components/Timeline";

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
                <View style={{flex: 1}}>
                    {/*<Text>LocationDetails</Text>*/}
                    {/*<Text>{id}</Text>*/}
                    <TimelineStyle />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
  );
}