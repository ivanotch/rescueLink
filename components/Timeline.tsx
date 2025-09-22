import {Text, View, Image} from 'react-native';
import Timeline from "react-native-timeline-flatlist";
import {color} from "nativewind/src/tailwind/color";

export default function TimelineStyle() {

    const data = [
        {
            time: "09:00",
            title: "Event 1",
            description: "This is the first event",
            imageUrl: "https://picsum.photos/200/300",
        },
        {
            time: "10:45",
            title: "Event 2",
            description: "This one has no image",
        },
    ];

    return (
                <Timeline
                    data={data}
                    style={{flex: 1}}
                    circleSize={20}
                    circleColor="gray"
                    lineColor="gray"
                    timeStyle={{color: "black", fontSize: 15}}
                    renderDetail={(rowData) => (
                        <View style={{ backgroundColor: "#fff", padding: 10, borderRadius: 8 }}>
                            <Text style={{ fontWeight: "bold" }}>{rowData.title}</Text>
                            <Text>{rowData.description}</Text>

                            {rowData.imageUrl && (
                                <Image
                                    source={{ uri: rowData.imageUrl }}
                                    style={{ width: "100%", height: 150, borderRadius: 8, marginTop: 5 }}
                                    resizeMode="cover"
                                />
                            )}
                        </View>
                    )}
                />
    )
}