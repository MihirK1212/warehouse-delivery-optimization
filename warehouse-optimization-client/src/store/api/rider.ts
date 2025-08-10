import { riderAdapter } from "@/types/rider/adapter";
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
                return _.map(response, riderAdapter);
            },
		}),

		getRider: build.query<Rider, string>({
			query: (riderId) => ({
				url: `rider/${riderId}`,
				method: "GET",
			}),
			providesTags: (result, error, id) => [{ type: "Rider", id }],
            transformResponse: (response: RiderDTO): Rider => {
                return riderAdapter(response);
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
				"DeliveryTasksBatch",
				"DeliveryTask",
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
