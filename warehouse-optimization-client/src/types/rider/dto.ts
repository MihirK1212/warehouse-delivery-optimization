export interface RiderDTO {
    _id?: string;
    name: string;
    age: number;
    bag_volume: number;
    phone_number: string;
}


export interface CreateRiderDTO {
    name: string;
    age: number;
    bag_volume: number;
    phone_number: string;
}

