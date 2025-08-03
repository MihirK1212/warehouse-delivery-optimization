import { CreateItemRequest, GetItemResponse } from "../item/dto";
import { GetRiderResponse } from "../rider/dto";
import { DeliveryInformationDTO } from "../common/dto";
import { RouteSegmentDTO } from "../common/dto";

export interface GetDeliveryTaskResponse {
	_id?: string;
	items: GetItemResponse[];
	delivery_information: DeliveryInformationDTO;
	rider?: GetRiderResponse;
	status:
		| "undispatched"
		| "dispatched"
		| "in_progress"
		| "completed"
		| "cancelled";
	delivery_route: RouteSegmentDTO[];
}

export interface DispatchDeliveryTasksRequest {
	delivery_task_ids: string[];
	rider_ids: string[];
}

export interface CreateItemAndDeliveryTaskRequest {
	item: CreateItemRequest;
	delivery_information: DeliveryInformationDTO;
}
