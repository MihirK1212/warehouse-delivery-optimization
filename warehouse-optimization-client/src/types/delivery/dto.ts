import { GetItemResponse } from "../item/dto";
import { GetRiderResponse } from "../rider/dto";
import { DeliveryInformationDTO } from "../common/dto";
import { RouteSegmentDTO } from "../common/dto";

export interface GetDeliveryTaskResponse {
    items: GetItemResponse[];
    delivery_information: DeliveryInformationDTO;
    rider?: GetRiderResponse;
    status: "undispatched" | "dispatched" | "in_progress" | "completed" | "cancelled";
    delivery_route: RouteSegmentDTO[];
}





