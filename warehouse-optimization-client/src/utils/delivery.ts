import { DeliveryTask } from "@/types/delivery/type";
import { DeliveryLocation } from "@/types/common/type";

export const getDeliveryLocation = (
	delivery: DeliveryTask | undefined
): DeliveryLocation | undefined => {
    if (!delivery) {
        return undefined;
    }
	return delivery.deliveryInformation.deliveryType === "pickup"
		? delivery?.items[0]?.itemLocation
		: delivery?.deliveryInformation.deliveryLocation || undefined;
};
