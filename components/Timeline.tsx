import {Text, View, Image} from 'react-native';
import Timeline from "react-native-timeline-flatlist";

interface TimelineProps {
    requestDetails: any | null;
    responses: any[];
}

export default function TimelineStyle({requestDetails, responses}: TimelineProps) {
    const data: any[] = [];

    if (requestDetails) {
        let urgencyColor = "gray";
        if (requestDetails.levelOfUrgency === "high") urgencyColor = "red";
        else if (requestDetails.levelOfUrgency === "medium") urgencyColor = "orange";
        else if (requestDetails.levelOfUrgency === "low") urgencyColor = "green";

        data.push({
            time: requestDetails.createdAt
                ? requestDetails.createdAt.toDate().toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })
                : "",
            title: requestDetails.concern,
            description: requestDetails.description,
            imageUrl: requestDetails.photoUrl,
            circleColor: urgencyColor,
            type: "request",
            extra: {
                wordedAddress: requestDetails.wordedAddress,
                helpStatus: requestDetails.helpStatus,
                location: {
                    latitude: requestDetails.location.latitude,
                    longitude: requestDetails.location.longitude,
                }
            }
        })

        responses.forEach((response) => {
            data.push({
                time: response.timestamp
                    ? response.timestamp.toDate().toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    : "",
                title: response.status,
                description: response.message,
                circleColor: "blue",
                type: "response",
                extra: {
                    personName: response.personName,
                }
            })
        })
    }

    return (
                <Timeline
                    data={data}
                    style={{flex: 1}}
                    circleSize={20}
                    lineColor="gray"
                    timeStyle={{color: "black", fontSize: 15, width: 60}}
                    timeContainerStyle={{ minWidth: 70, marginTop: -5 }}
                    circleStyle={{ top: 0 }}
                    renderDetail={(rowData) => (
                        // <View
                        //     style={{
                        //         backgroundColor: rowData.type === "request" ? "#ffe6e6" : "#f0f4ff",
                        //         padding: 10,
                        //         borderRadius: 8,
                        //     }}
                        // >
                        //     {/*"User Submitted an 'Urgent/moderate' request"*/}
                        //     {/*Concern / Help status*/}
                        //     {/*Description*/}
                        //     {/*Image*/}
                        //     {/*Worded Address*/}
                        //     {/*Pin Location Button*/}
                        //     <Text style={{ fontWeight: "bold" }}>{rowData.title}</Text>
                        //     <Text>{rowData.description}</Text>
                        //
                        //     {rowData.imageUrl && (
                        //         // make image clickable to expand
                        //         <Image
                        //             source={{ uri: rowData.imageUrl }}
                        //             style={{ width: "100%", height: 150, borderRadius: 8, marginTop: 5 }}
                        //             resizeMode="cover"
                        //         />
                        //     )}
                        // </View>
                        <View
                            style={{
                                backgroundColor: rowData.type === "request" ? "#ffe6e6" : "#f0f4ff",
                                padding: 5,
                                borderRadius: 8,
                            }}
                        >
                            <Text style={{ fontWeight: "bold" }}>{rowData.title}</Text>
                            <Text>{rowData.description}</Text>

                            {/* Show extra info */}
                            {rowData.extra?.wordedAddress && (
                                <Text style={{ marginTop: 5, color: "gray" }}>
                                    📍 {rowData.extra.wordedAddress}
                                </Text>
                            )}

                            {rowData.extra?.helpStatus && (
                                <Text>Status: {rowData.extra.helpStatus}</Text>
                            )}

                            {rowData.extra?.personName && (
                                <Text>Responder: {rowData.extra.personName}</Text>
                            )}

                            {/* If image exists */}
                            {rowData.imageUrl && (
                                <Image
                                    source={{ uri: rowData.imageUrl }}
                                    style={{
                                        width: "100%",
                                        height: 150,
                                        borderRadius: 8,
                                        marginTop: 5,
                                    }}
                                    resizeMode="cover"
                                />
                            )}
                        </View>
                    )}

                    // renderCircle={(rowData) => (
                    //     <View
                    //         style={{
                    //             backgroundColor: rowData.circleColor || "gray",
                    //         }}
                    //     />
                    // )}
                />
    );
}