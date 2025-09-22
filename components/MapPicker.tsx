import React, {useState, useEffect} from "react";
import { View, Text, Modal, Button,ActivityIndicator } from "react-native";
import MapView, {Marker} from "react-native-maps";
import * as Location from "expo-location";

type Props = {
    visible: boolean;
    onClose: () => void;
    onLocationSelect: (location: {latitude: number; longitude: number; address?: string}) => void;
};

export default function MapPicker({visible, onClose, onLocationSelect}: Props) {
    const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (visible) {
            (async () => {
                const {status} = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    alert("Permission to access location was denied");
                    setLoading(false);
                    return;
                }

                const loc = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude
                });
                setLoading(false);
            })();
        }
    }, [visible]);

    const handleForm = async () => {
        if (!location) return;

        const address = await Location.reverseGeocodeAsync(location);
        const formattedAddress = address[0] ?
            `${address[0].name}, ${address[0].city}, ${address[0].region}` :
            "unknown location";

        onLocationSelect({...location, address: formattedAddress});
        onClose();
    }
      return (
        <Modal visible={visible} animationType="slide">
            <View style={{ flex: 1 }}>
                {loading ? (
                    <ActivityIndicator style={{flex:1}} size="large" />
                ) : (
                    <>
                        <MapView
                            style={{flex: 1}}
                            initialRegion={{
                                latitude: location?.latitude || 37.78825,
                                longitude: location?.longitude || -122.4324,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        >
                            {location && (
                                <Marker coordinate={location} draggable onDragEnd={(e) => setLocation(e.nativeEvent.coordinate)} />
                            )}
                        </MapView>

                        <View style={{flexDirection: "row", justifyContent: "space-between", padding: 10}}>
                            <Button title="Cancel" onPress={onClose} />
                            <Button title="Confirm Location" onPress={handleForm} />
                        </View>
                    </>
                )}
            </View>
        </Modal>
      );
}