export interface HelpRequest {
    personId: string; // phone number
    concern: string;
    description: string;
    photoUrl?: string;
    location: {
        latitude: number;
        longitude: number;
    };
    wordedAddress: string;
    levelOfUrgency: "low" | "medium" | "high";
    helpStatus: "onGoing" | "moreHelp" | "completed";
    createdAt: string;
    types: "humans" | "animals"
}

export interface Responses {
    personId: string;
    message: string;
    status: "accepted" | "cancelled"
    timestamp: string;
}