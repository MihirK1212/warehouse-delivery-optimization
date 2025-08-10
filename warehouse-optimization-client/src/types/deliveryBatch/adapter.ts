import { DeliveryTasksBatchDTO } from "./dto"
import { DeliveryTasksBatch } from "./type"
import _ from "lodash"
import { deliveryTaskAdapter } from "../delivery/adapter"
import { riderAdapter } from "../rider/adapter"


export const deliveryTasksBatchAdapter = (deliveryTasksBatch: DeliveryTasksBatchDTO): DeliveryTasksBatch => {
    return {
        id: deliveryTasksBatch._id || "",
        rider: riderAdapter(deliveryTasksBatch.rider),
        date: deliveryTasksBatch.date,
        tasks: _.map(deliveryTasksBatch.tasks, (task) => ({
            deliveryTask: deliveryTaskAdapter(task.delivery_task),
            orderKey: task.order_key,
        })),
        currentTaskIndex: deliveryTasksBatch.current_task_index,
        version: deliveryTasksBatch.version,
    }
}   