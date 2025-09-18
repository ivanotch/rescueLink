import {collection, onSnapshot, addDoc, serverTimestamp} from "firebase/firestore";
import {HelpRequestWithId} from "@/types/helpRequestWithId";
import {HelpRequest} from "@/types/helpRequest";
import * as Location from "expo-location";
import {db} from "@/services/firebaseConfig";

//listen to realtime update on helpRequest to display on home page
export function listenToRequest(callback: (request: HelpRequestWithId[]) => void) {
    return onSnapshot(collection(db, "helpRequest"), (snapshot) => {
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as HelpRequestWithId[];
        callback(data)
    });
}

export async function createHelpRequest(request: Omit<HelpRequest, "wordedAddress" | "createdAt">) {
    try {
        // Convert lat/lng to address
        const [address] = await Location.reverseGeocodeAsync({
            latitude: request.location.latitude,
            longitude: request.location.longitude,
        });

        const wordedAddress = address
            ? `${address.street || ""} ${address.subregion || ""}, ${address.region || ""}, ${address.country || ""}`
            : "Unknown location";

        // Save to Firestore
        const docRef = await addDoc(collection(db, "helpRequest"), {
            ...request,
            wordedAddress,
            createdAt: serverTimestamp(), // Firestore timestamp
        });

        console.log("Help request created with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error creating help request:", error);
        throw error;
    }
}
