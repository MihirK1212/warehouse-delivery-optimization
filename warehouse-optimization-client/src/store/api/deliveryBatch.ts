import { api } from "./base";
import { DispatchDeliveryTasksDTO, DispatchPickupDeliveryTasksDTO } from "@/types/delivery/dto";
import { DeliveryTasksBatchDTO } from "@/types/deliveryBatch/dto";
import { DeliveryTasksBatch } from "@/types/deliveryBatch/type";
import { deliveryTasksBatchAdapter } from "@/types/deliveryBatch/adapter";
import { DeliveryStatus } from "@/types/deliveryStatus";

const deliveryBatchAPI = api.injectEndpoints({
	endpoints: (build) => ({
		dispatchDeliveryTasks: build.mutation<void, DispatchDeliveryTasksDTO>({
			query: (payload) => ({
				url: "delivery_batch/dispatch",
				method: "POST",
				body: payload,
			}),
			invalidatesTags: ["Rider", "DeliveryTask", "DeliveryTasksBatch"],
		}),

		getDeliveryTasksBatchForRider: build.query<DeliveryTasksBatch, string>({
			query: (riderId) => ({
				url: `delivery_batch/rider/${riderId}`,
				method: "GET",
			}),
			providesTags: (result, error, id) => [
				{ type: "DeliveryTasksBatch", id },
			],
			transformResponse: (
				response: DeliveryTasksBatchDTO
			): DeliveryTasksBatch => {
				return deliveryTasksBatchAdapter(response);
			},
		}),

		updateDeliveryTaskStatus: build.mutation<
			void,
			{ deliveryTaskId: string; status: DeliveryStatus }
		>({
			query: ({ deliveryTaskId, status }) => ({
				url: `delivery_batch/task/${deliveryTaskId}/status`,
				method: "PATCH",
				body: { status_name: status.name },
			}),
			invalidatesTags: (result, error, { deliveryTaskId }) => [
				{ type: "DeliveryTask", id: deliveryTaskId },
				"Rider",
				"DeliveryTask",
				"DeliveryTasksBatch",
			],
		}),

		dispatchPickupDeliveryTask: build.mutation<
			void,
			DispatchPickupDeliveryTasksDTO
		>({
			query: (payload) => ({
				url: "delivery_batch/pickup",
				method: "POST",
				body: payload.delivery_task_ids,
			}),
			invalidatesTags: ["Rider", "DeliveryTask", "DeliveryTasksBatch",],
		}),

	}),
	overrideExisting: false,
});

export const {
	useDispatchDeliveryTasksMutation,
	useGetDeliveryTasksBatchForRiderQuery,
	useUpdateDeliveryTaskStatusMutation,
	useDispatchPickupDeliveryTaskMutation,
} = deliveryBatchAPI;
