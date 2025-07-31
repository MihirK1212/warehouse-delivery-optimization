import { ToolScanInformationDTO, DeliveryLocationDTO } from "../common/dto";

export interface GetItemResponse {
    name: string;
    description: string;
    tool_scan_information: ToolScanInformationDTO;
    item_location: DeliveryLocationDTO;
    timestamp_created: string;
}