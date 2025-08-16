import { DeliveryTaskDTO } from "../delivery/dto";
import { RiderDTO } from "../rider/dto";
import { RouteSegmentDTO } from "../common/dto";

interface DeliveryTaskRef {
    delivery_task: DeliveryTaskDTO; 
    order_key: number;
}

interface DeliveryTasksBatchRouteSegmentDTO {
    prev_delivery_task_id: string;
    task_delivery_id: string;
    route: RouteSegmentDTO[];
}

export interface DeliveryTasksBatchDTO {
    _id: string;
    rider: RiderDTO;
    date: string;
    tasks: DeliveryTaskRef[];
    current_task_index: number;
    version?: number; 
    delivery_tasks_batch_route?: DeliveryTasksBatchRouteSegmentDTO[];
}

