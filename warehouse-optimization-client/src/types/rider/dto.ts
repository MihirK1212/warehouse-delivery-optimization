export interface RiderDTO {
    _id?: string;
    name: string;
    age: number;
    bag_volume: number;
    phone_number: string;
    assigned_delivery_tasks_batch_id: string;
}


export interface CreateRiderDTO {
    name: string;
    age: number;
    bag_volume: number;
    phone_number: string;
}

