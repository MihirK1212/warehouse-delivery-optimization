import { DeliveryTask } from "../delivery/type";
import { Rider } from "../rider/type";

export type DeliveryTaskRef = {
    deliveryTask: DeliveryTask;
    orderKey: number;
}

export type DeliveryTasksBatch = {
    id: string;
    rider: Rider;
    date: string;
    tasks: DeliveryTaskRef[];
    currentTaskIndex: number;
    version?: number; 
}