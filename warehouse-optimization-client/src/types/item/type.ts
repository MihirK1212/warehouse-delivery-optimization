import { ToolScanInformation, DeliveryLocation } from "../common/type";
import moment from "moment";

export type Item = {
    name: string;
    description: string;
    toolScanInformation: ToolScanInformation;
    itemLocation: DeliveryLocation;
    timestampCreated: moment.Moment;
}