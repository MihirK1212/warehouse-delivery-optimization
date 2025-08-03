import { ToolScanInformationDTO, DeliveryLocationDTO } from "../common/dto";

export interface GetItemResponse {
    _id?: string;
    name: string;
    description: string;
    tool_scan_information?: ToolScanInformationDTO;
    item_location?: DeliveryLocationDTO;
    timestamp_created: string;
}


export interface CreateItemRequest {
    name: string;
    description: string;
    tool_scan_information?: ToolScanInformationDTO;
    item_location?: DeliveryLocationDTO;
}

export interface ScanItemRequest {
    weight: number;
    volume: number;
}