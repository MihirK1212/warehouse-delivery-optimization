import { Item } from "../item/type";
import { DeliveryInformation } from "../common/type";
import { DeliveryStatus } from "../deliveryStatus";


export type DeliveryTask  = {
    id: string;
    items: Item[],
    deliveryInformation: DeliveryInformation,
    status: DeliveryStatus
}