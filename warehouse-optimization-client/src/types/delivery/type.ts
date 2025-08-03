import { Item } from "../item/type";
import { DeliveryInformation, RouteSegment } from "../common/type";
import { Rider } from "../rider/type";

export type DeliveryTask  = {
    id: string;
    items: Item[],
    deliveryInformation: DeliveryInformation,
    rider?: Rider,
    status: "undispatched" | "dispatched" | "in_progress" | "completed" | "cancelled",
    deliveryRoute: RouteSegment[],
}