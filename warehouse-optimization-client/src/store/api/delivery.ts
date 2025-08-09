import { api } from "./base";
import {
	CreateItemAndDeliveryTaskDTO,
	DeliveryTaskDTO,
	DispatchDeliveryTasksDTO,
} from "@/types/delivery/dto";
import { DeliveryTask } from "@/types/delivery/type";
import _ from "lodash";
import { DeliveryStatus } from "@/types/deliveryStatus";
import { deliveryTaskAdapter } from "@/types/delivery/adapter";

const deliveryAPI = api.injectEndpoints({
	endpoints: (build) => ({
		getAllDeliveryTasks: build.query<DeliveryTask[], void>({
			query: () => ({
				url: `delivery/`,
				method: "GET",
			}),
			transformResponse: (
				response: DeliveryTaskDTO[]
			): DeliveryTask[] => {
				if (Array.isArray(response)) {
					return _.map(response, deliveryTaskAdapter);
				}
				return [];
			},
			providesTags: ["DeliveryTask"],
		}),

		getUndispatchedDeliveryTasks: build.query<DeliveryTask[], void>({
			query: () => ({
				url: `delivery/undispatched`,
				method: "GET",
			}),
			transformResponse: (
				response: DeliveryTaskDTO[]
			): DeliveryTask[] => {
				if (Array.isArray(response)) {
					return _.map(response, deliveryTaskAdapter);
				}
				return [];
			},
			providesTags: ["DeliveryTask"],
		}),

		getDeliverTasksForRider: build.query<DeliveryTask[], string>({
			query: (riderId) => ({
				url: `delivery/rider/${riderId}`,
				method: "GET",
			}),
			transformResponse: (
				response: DeliveryTaskDTO[]
			): DeliveryTask[] => {
				if (Array.isArray(response)) {
					return _.map(response, deliveryTaskAdapter);
				}
				return [];
			},
			providesTags: ["DeliveryTask"],
		}),

		createItemWithDeliveryTask: build.mutation<
			void,
			CreateItemAndDeliveryTaskDTO
		>({
			query: (payload) => ({
				url: "delivery/item_and_task",
				method: "POST",
				body: payload,
			}),
			invalidatesTags: ["DeliveryTask", "Item"],
		}),

		dispatchDeliveryTasks: build.mutation<void, DispatchDeliveryTasksDTO>({
			query: (payload) => ({
				url: "delivery/dispatch",
				method: "POST",
				body: payload,
			}),
			invalidatesTags: ["DeliveryTask"],
		}),

		addDynamicPickupDeliveryTasks: build.mutation<
			void,
			CreateItemAndDeliveryTaskDTO[]
		>({
			query: (pickupItems) => ({
				url: "delivery/pickup",
				method: "POST",
				body: pickupItems,
			}),
			invalidatesTags: ["DeliveryTask"],
		}),

		updateDeliveryTaskStatus: build.mutation<
			void,
			{ id: string; status: DeliveryStatus }
		>({
			query: ({ id, status }) => ({
				url: `delivery/${id}/status`,
				method: "PATCH",
				body: { status_name: status.name },
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: "DeliveryTask", id },
				"DeliveryTask",
			],
		}),

		deleteDeliveryTask: build.mutation<void, string>({
			query: (deliveryTaskId) => ({
				url: `delivery/${deliveryTaskId}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [
				{ type: "DeliveryTask", id },
				"DeliveryTask",
			],
		}),
	}),
	overrideExisting: false,
});

export const {
	useGetAllDeliveryTasksQuery,
	useGetUndispatchedDeliveryTasksQuery,
	useGetDeliverTasksForRiderQuery,
	useCreateItemWithDeliveryTaskMutation,
	useDispatchDeliveryTasksMutation,
	useAddDynamicPickupDeliveryTasksMutation,
	useUpdateDeliveryTaskStatusMutation,
	useDeleteDeliveryTaskMutation,
} = deliveryAPI;
