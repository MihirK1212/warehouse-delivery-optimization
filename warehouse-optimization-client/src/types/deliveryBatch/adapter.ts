import { DeliveryTasksBatchDTO } from "./dto";
import { DeliveryTasksBatch } from "./type";
import _ from "lodash";
import { deliveryTaskAdapter } from "../delivery/adapter";
import { riderAdapter } from "../rider/adapter";
import { routeSegmentAdapter } from "../common/adapter";

export const deliveryTasksBatchAdapter = (
	deliveryTasksBatch: DeliveryTasksBatchDTO
): DeliveryTasksBatch => {
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
		deliveryTasksBatchRoute: _.map(
			deliveryTasksBatch.delivery_tasks_batch_route,
			(routeSegment) => ({
				prevDeliveryTaskId: routeSegment.prev_delivery_task_id,
				taskDeliveryId: routeSegment.task_delivery_id,
				route: _.map(routeSegment.route, (route) =>
					routeSegmentAdapter(route)
				),
			})
		),
	};
};
