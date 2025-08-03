import { ToolScanInformation, DeliveryLocation } from "../common/type";
import moment from "moment";

export type Item = {
    id: string;
    name: string;
    description: string;
    toolScanInformation?: ToolScanInformation;
    itemLocation?: DeliveryLocation;
    timestampCreated: moment.Moment;
}