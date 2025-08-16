import { DeliveryTask } from "../delivery/type";
import { Rider } from "../rider/type";
import { RouteSegment } from "../common/type";

export type DeliveryTaskRef = {
    deliveryTask: DeliveryTask;
    orderKey: number;
}

export type DeliveryTasksBatchRouteSegment = {
    prevDeliveryTaskId: string; 
    taskDeliveryId: string;
    route: RouteSegment[];
}


export type DeliveryTasksBatch = {
    id: string;
    rider: Rider;
    date: string;
    tasks: DeliveryTaskRef[];
    currentTaskIndex: number;
    version?: number; 
    deliveryTasksBatchRoute?: DeliveryTasksBatchRouteSegment[]
}