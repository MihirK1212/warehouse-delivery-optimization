import { RiderDTO } from "./dto";
import { Rider } from "./type";

export const riderAdapter = (rider: RiderDTO): Rider => {
    return {
        id: rider._id || "",
        name: rider.name,
        age: rider.age,
        bagVolume: rider.bag_volume,
        phoneNumber: rider.phone_number,
        assignedDeliveryTaskIds: rider.assigned_delivery_task_ids,
    }
}   