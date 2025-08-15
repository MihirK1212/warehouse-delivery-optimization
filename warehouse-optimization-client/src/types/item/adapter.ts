import { ItemDTO } from "./dto";
import { Item } from "./type";
import moment from "moment";

export const itemAdapter = (item: ItemDTO): Item => {
    return {
        id: item._id || "",
        name: item.name,
        description: item.description,
        toolScanInformation: item.tool_scan_information,
        itemLocation: item.item_location,
        timestampCreated: moment.utc(item.timestamp_created),
    }
}   