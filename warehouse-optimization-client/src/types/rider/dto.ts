export interface GetRiderResponse {
    _id?: string;
    name: string;
    age: number;
    bag_volume: number;
    phone_number: string;
}


export interface CreateRiderRequest {
    name: string;
    age: number;
    bag_volume: number;
    phone_number: string;
}

