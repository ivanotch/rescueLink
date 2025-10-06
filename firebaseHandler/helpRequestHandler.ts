import {collection, doc, getDoc, query, orderBy, onSnapshot, addDoc, serverTimestamp} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {HelpRequestWithId} from "@/types/helpRequestWithId";
import {HelpRequest} from "@/types/helpRequest";
import * as Location from "expo-location";
import {db} from "@/services/firebaseConfig";
import {Person} from "@/types/persons";

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

let isSubmitting = false;
export async function createHelpRequest(request: Omit<HelpRequest, "wordedAddress" | "createdAt"> & {photoUri?: string}) {

    if (isSubmitting) return;
    isSubmitting = true;

    try {

        let photoUrl = "";

        if (request.photoUri) {
            const storage = getStorage();
            const response = await fetch(request.photoUri);
            const blob = await response.blob();

            const fileName = `helpRequests/${Date.now()}.jpg`;
            const storageRef = ref(storage, fileName);

            await uploadBytes(storageRef, blob);
            photoUrl = await getDownloadURL(storageRef);
        }
        // Convert lat/lng to address
        const [address] = await Location.reverseGeocodeAsync({
            latitude: request.location.latitude,
            longitude: request.location.longitude,
        });

        const wordedAddress = address
            ? `${address.name || address.street || ""}, ${address.district || address.city || ""}, ${address.subregion || ""}, ${address.region || ""}, ${address.country || ""}`
                .replace(/,\s*,/g, ",") // remove double commas
                .trim()
            : "Unknown location";

        const { photoUri, ...rest } = request;
        // Save to Firestore
        const docRef = await addDoc(collection(db, "helpRequest"), {
            ...rest,
            photoUrl,
            wordedAddress,
            createdAt: serverTimestamp(), // Firestore timestamp
        });

        console.log("Help request created with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error creating help request:", error);
        throw error;
    } finally {
        isSubmitting = false;
    }
}

export const subscribeToHelpRequestWithResponses = (id: string, callback: (data: {requestDetails: any | null; responses: any[]}) => void)=> {
    let requestData: any | null = null;
    let responsesData: any[] = [];

    const unsubscribeDoc = onSnapshot(doc(db, "helpRequest", id), (docSnap) => {
        requestData = docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
        callback({requestDetails: requestData, responses: responsesData});
    });

    const unsubscribeSub = onSnapshot(
        query(collection(db, "helpRequest", id, "responses"), orderBy("timestamp", "asc")),
        async (querySnapshot) => {
            const responsesData = await Promise.all(
                querySnapshot.docs.map(async (d) => {
                    const data = d.data();

                    let personName = "";
                    if (data.personId) {
                        try {
                            const userSnap = await getDoc(data.personId); // personId is a DocumentReference
                            if (userSnap.exists()) {
                                const userData = userSnap.data() as Person;
                                personName = userData.name ?? "Unknown User";
                            }
                        } catch (err) {
                            console.error("Error fetching user:", err);
                        }
                    }

                    return {
                        id: d.id,
                        ...data,
                        personName, // ✅ add name here
                    };
                })
            );

            callback({ requestDetails: requestData, responses: responsesData });
        }
    );

    return () => {
        unsubscribeDoc();
        unsubscribeSub();
    }
}

