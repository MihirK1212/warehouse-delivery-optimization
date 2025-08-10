import { itemAdapter } from "@/types/item/adapter";
import { api } from "./base";
import { ItemDTO, ScanItemDTO } from "@/types/item/dto";
import { Item } from "@/types/item/type";
import _ from "lodash";

const itemAPI = api.injectEndpoints({
	endpoints: (build) => ({
		getItems: build.query<Item[], void>({
			query: () => ({
				url: "item/",
				method: "GET",
			}),
			providesTags: ["Item"],
            transformResponse: (response: ItemDTO[]): Item[] => {
                return _.map(response, itemAdapter);
            },
		}),

		getItem: build.query<Item, string>({
			query: (itemId) => ({
				url: `item/${itemId}`,
				method: "GET",
			}),
			providesTags: (result, error, id) => [{ type: "Item", id }],
            transformResponse: (response: ItemDTO): Item => {
                return itemAdapter(response);
            },
		}),

		scanItem: build.mutation<
			void,
			{ itemId: string; scanData: ScanItemDTO }
		>({
			query: ({ itemId, scanData }) => ({
				url: `item/${itemId}/scan`,
				method: "PUT",
				body: scanData,
			}),
			invalidatesTags: (result, error, { itemId }) => [
				{ type: "Item", id: itemId },
				"Item",
				"DeliveryTask",
				"DeliveryTasksBatch",
			],
		}),

		deleteItem: build.mutation<void, string>({
			query: (itemId) => ({
				url: `item/${itemId}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [
				{ type: "Item", id },
				"Item",
			],
		}),
	}),
	overrideExisting: false,
});

export const {
	useGetItemsQuery,
	useGetItemQuery,
	useScanItemMutation,
	useDeleteItemMutation,
} = itemAPI;
