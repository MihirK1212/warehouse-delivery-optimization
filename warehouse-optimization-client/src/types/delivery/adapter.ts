import { DeliveryStatus } from "../deliveryStatus";
import { DeliveryTaskDTO } from "./dto";
import { DeliveryTask } from "./type";
import _ from "lodash";
import moment from "moment";

export const deliveryTaskAdapter = (deliveryTask: DeliveryTaskDTO): DeliveryTask => {
    return {
        id: deliveryTask._id || "",
        items: _.map(deliveryTask.items, (item) => ({
            id: item._id || "",
            name: item.name,
            description: item.description,
            toolScanInformation: item.tool_scan_information,
            itemLocation: item.item_location,
            timestampCreated: moment.utc(item.timestamp_created),
        })),
        deliveryInformation: {
            expectedDeliveryTime:
                moment.utc(deliveryTask.delivery_information
                    .expected_delivery_time),
            deliveryType:
                deliveryTask.delivery_information.delivery_type,
            awbId: deliveryTask.delivery_information.awb_id,
            deliveryLocation:
                deliveryTask.delivery_information
                    .delivery_location,
        },
        rider: deliveryTask.rider
            ? {
                    id: deliveryTask.rider._id || "",
                    name: deliveryTask.rider.name,
                    age: deliveryTask.rider.age,
                    bagVolume: deliveryTask.rider.bag_volume,
                    phoneNumber:
                        deliveryTask.rider.phone_number,
                    assignedDeliveryTaskIds:
                        deliveryTask.rider.assigned_delivery_task_ids,
              }
            : undefined,
        status: DeliveryStatus.values().find(
            (status) => status.name === deliveryTask.status
        ) || DeliveryStatus.UNDISPATCHED,
        deliveryRoute: _.map(
            deliveryTask.delivery_route,
            (route) => ({
                distance: route.distance,
                timeTaken: route.time_taken,
                instruction: route.instruction,
                polyline: _.map(
                    route.polyline,
                    (coordinate) => ({
                        latitude: coordinate.latitude,
                        longitude: coordinate.longitude,
                    })
                ),
            })
        ),
    };
};