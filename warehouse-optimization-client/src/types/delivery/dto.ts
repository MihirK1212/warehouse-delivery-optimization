import { CreateItemDTO, ItemDTO } from "../item/dto";
import { RiderDTO } from "../rider/dto";
import { DeliveryInformationDTO } from "../common/dto";
import { RouteSegmentDTO } from "../common/dto";

export interface DeliveryTaskDTO {
	_id?: string;
	items: ItemDTO[];
	delivery_information: DeliveryInformationDTO;
	rider?: RiderDTO;
	status:
		| "undispatched"
		| "dispatched"
		| "in_progress"
		| "completed"
		| "cancelled";
	delivery_route: RouteSegmentDTO[];
}

export interface DispatchDeliveryTasksDTO {
	delivery_task_ids: string[];
	rider_ids: string[];
}

export interface CreateItemAndDeliveryTaskDTO {
	item: CreateItemDTO;
	delivery_information: DeliveryInformationDTO;
}
