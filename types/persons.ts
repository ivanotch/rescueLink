export interface Location {
    latitude: number;
    longitude: number;
}

export interface Address {
    houseNo: string;
    street: string;
    barangay: string;
    municipality: string;
    region: string;
    zipCode: string;
    location: Location;
}

export interface Person {
    name: string;
    phoneNumber: string;
    email: string;
    profileCompletionStep: number;
    address: Address;
    validIdUrl: string;
    isValidated: boolean;
}