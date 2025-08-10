import { api } from "./base";
import {
	CreateItemAndDeliveryTaskDTO,
	DeliveryTaskDTO,
} from "@/types/delivery/dto";
import { DeliveryTask } from "@/types/delivery/type";
import _ from "lodash";
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
			providesTags: ["DeliveryTask", "DeliveryTasksBatch"],
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
			providesTags: ["DeliveryTask", "DeliveryTasksBatch"],
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
			providesTags: ["DeliveryTask", "DeliveryTasksBatch"],
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
			invalidatesTags: ["DeliveryTask", "Item", "DeliveryTasksBatch"],
		}),

		deleteDeliveryTask: build.mutation<void, string>({
			query: (deliveryTaskId) => ({
				url: `delivery/${deliveryTaskId}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [
				{ type: "DeliveryTask", id },
				"DeliveryTask",
				"DeliveryTasksBatch",
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
	useDeleteDeliveryTaskMutation,
} = deliveryAPI;
