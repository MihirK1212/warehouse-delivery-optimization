import { DeliveryTaskDTO } from "../delivery/dto";
import { RiderDTO } from "../rider/dto";

interface DeliveryTaskRef {
    delivery_task: DeliveryTaskDTO; 
    order_key: number;
}

export interface DeliveryTasksBatchDTO {
    _id: string;
    rider: RiderDTO;
    date: string;
    tasks: DeliveryTaskRef[];
    current_task_index: number;
    version?: number; 
}

