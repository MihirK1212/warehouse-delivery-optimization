import { Item } from "../item/type";
import { DeliveryInformation, RouteSegment } from "../common/type";
import { Rider } from "../rider/type";
import { DeliveryStatus } from "../deliveryStatus";

export type DeliveryTask  = {
    id: string;
    items: Item[],
    deliveryInformation: DeliveryInformation,
    rider?: Rider,
    status: DeliveryStatus,
    deliveryRoute: RouteSegment[],
}