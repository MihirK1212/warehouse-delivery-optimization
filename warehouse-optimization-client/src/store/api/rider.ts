import { api } from "./base";
import { CreateRiderDTO, RiderDTO } from "@/types/rider/dto";
import { Rider } from "@/types/rider/type";
import _ from "lodash";	

const riderAPI = api.injectEndpoints({
	endpoints: (build) => ({
		getRiders: build.query<Rider[], void>({
			query: () => ({
				url: "rider/",
				method: "GET",
			}),
			providesTags: ["Rider"],
            transformResponse: (response: RiderDTO[]): Rider[] => {
                return _.map(response, (rider) => ({
                    id: rider._id || "",
                    name: rider.name,
                    age: rider.age,
                    bagVolume: rider.bag_volume,
                    phoneNumber: rider.phone_number,
                    assignedDeliveryTaskIds: rider.assigned_delivery_task_ids,
                }));
            },
		}),

		getRider: build.query<Rider, string>({
			query: (riderId) => ({
				url: `rider/${riderId}`,
				method: "GET",
			}),
			providesTags: (result, error, id) => [{ type: "Rider", id }],
            transformResponse: (response: RiderDTO): Rider => {
                return {
                    id: response._id || "",
                    name: response.name,
                    age: response.age,
                    bagVolume: response.bag_volume,
                    phoneNumber: response.phone_number,
                    assignedDeliveryTaskIds: response.assigned_delivery_task_ids,
                };
            },
		}),

		createRiders: build.mutation<void, CreateRiderDTO[]>({
			query: (riders) => ({
				url: "rider/",
				method: "POST",
				body: riders,
			}),
			invalidatesTags: ["Rider"],
		}),

		deleteRider: build.mutation<void, string>({
			query: (riderId) => ({
				url: `rider/${riderId}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [
				{ type: "Rider", id },
				"Rider",
			],
		}),
	}),
	overrideExisting: false,
});

export const {
	useGetRidersQuery,
	useGetRiderQuery,
	useCreateRidersMutation,
	useDeleteRiderMutation,
} = riderAPI;
