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
    address: Address;
    validIdUrl: string;
}