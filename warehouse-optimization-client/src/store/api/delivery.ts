import { api } from "./base";
import {
	CreateItemAndDeliveryTaskRequest,
	GetDeliveryTaskResponse,
	DispatchDeliveryTasksRequest,
} from "@/types/delivery/dto";
import { DeliveryTask } from "@/types/delivery/type";
import moment from "moment";
import _ from "lodash";

const deliveryAPI = api.injectEndpoints({
	endpoints: (build) => ({
		getAllDeliveryTasks: build.query<DeliveryTask[], void>({
			query: () => ({
				url: `delivery/`,
				method: "GET",
			}),
			transformResponse: (
				response: GetDeliveryTaskResponse[]
			): DeliveryTask[] => {
				if (Array.isArray(response)) {
					return _.map(response, (deliveryTask) => ({
						id: deliveryTask._id || "",
						items: _.map(deliveryTask.items, (item) => ({
							id: item._id || "",
							name: item.name,
							description: item.description,
							toolScanInformation: item.tool_scan_information,
							itemLocation: item.item_location,
							timestampCreated: moment(item.timestamp_created),
						})),
						deliveryInformation: {
							expectedDeliveryTime:
								deliveryTask.delivery_information
									.expected_delivery_time,
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
							  }
							: undefined,
						status: deliveryTask.status as
							| "undispatched"
							| "dispatched"
							| "in_progress"
							| "completed"
							| "cancelled",
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
					}));
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
				response: GetDeliveryTaskResponse[]
			): DeliveryTask[] => {
				if (Array.isArray(response)) {
					return _.map(response, (deliveryTask) => ({
						id: deliveryTask._id || "",
						items: _.map(deliveryTask.items, (item) => ({
							id: item._id || "",
							name: item.name,
							description: item.description,
							toolScanInformation: item.tool_scan_information,
							itemLocation: item.item_location,
							timestampCreated: moment(item.timestamp_created),
						})),
						deliveryInformation: {
							expectedDeliveryTime:
								deliveryTask.delivery_information
									.expected_delivery_time,
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
							  }
							: undefined,
						status: deliveryTask.status as
							| "undispatched"
							| "dispatched"
							| "in_progress"
							| "completed"
							| "cancelled",
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
					}));
				}
				return [];
			},
			providesTags: ["DeliveryTask"],
		}),

		createItemWithDeliveryTask: build.mutation<
			void,
			CreateItemAndDeliveryTaskRequest
		>({
			query: (payload) => ({
				url: "delivery/item_and_task",
				method: "POST",
				body: payload,
			}),
			invalidatesTags: ["DeliveryTask", "Item"],
		}),

		dispatchDeliveryTasks: build.mutation<
			void,
			DispatchDeliveryTasksRequest
		>({
			query: (payload) => ({
				url: "delivery/dispatch",
				method: "POST",
				body: payload,
			}),
			invalidatesTags: ["DeliveryTask"],
		}),

		addDynamicPickupDeliveryTasks: build.mutation<
			void,
			CreateItemAndDeliveryTaskRequest[]
		>({
			query: (pickupItems) => ({
				url: "delivery/pickup",
				method: "POST",
				body: pickupItems,
			}),
			invalidatesTags: ["DeliveryTask"],
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
	useCreateItemWithDeliveryTaskMutation,
	useDispatchDeliveryTasksMutation,
	useAddDynamicPickupDeliveryTasksMutation,
	useDeleteDeliveryTaskMutation,
} = deliveryAPI;
