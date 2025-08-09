export interface RiderDTO {
    _id?: string;
    name: string;
    age: number;
    bag_volume: number;
    phone_number: string;
    assigned_delivery_task_ids: string[];
}


export interface CreateRiderDTO {
    name: string;
    age: number;
    bag_volume: number;
    phone_number: string;
}

