import { api } from "./base";
import { GetItemResponse, ScanItemRequest } from "@/types/item/dto";
import { Item } from "@/types/item/type";
import _ from "lodash";
import moment from "moment";

const itemAPI = api.injectEndpoints({
	endpoints: (build) => ({
		getItems: build.query<Item[], void>({
			query: () => ({
				url: "item/",
				method: "GET",
			}),
			providesTags: ["Item"],
            transformResponse: (response: GetItemResponse[]): Item[] => {
                return _.map(response, (item) => ({
                    id: item._id || "",
                    name: item.name,
                    description: item.description,
                    toolScanInformation: item.tool_scan_information,
                    itemLocation: item.item_location,
                    timestampCreated: moment(item.timestamp_created),
                }));
            },
		}),

		getItem: build.query<Item, string>({
			query: (itemId) => ({
				url: `item/${itemId}`,
				method: "GET",
			}),
			providesTags: (result, error, id) => [{ type: "Item", id }],
            transformResponse: (response: GetItemResponse): Item => {
                return {
                    id: response._id || "",
                    name: response.name,
                    description: response.description,
                    toolScanInformation: response.tool_scan_information,
                    itemLocation: response.item_location,
                    timestampCreated: moment(response.timestamp_created),
                };
            },
		}),

		scanItem: build.mutation<
			void,
			{ itemId: string; scanData: ScanItemRequest }
		>({
			query: ({ itemId, scanData }) => ({
				url: `item/${itemId}/scan`,
				method: "PUT",
				body: scanData,
			}),
			invalidatesTags: (result, error, { itemId }) => [
				{ type: "Item", id: itemId },
				"Item",
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
