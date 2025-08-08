import { ToolScanInformationDTO, DeliveryLocationDTO } from "../common/dto";

export interface ItemDTO {
    _id?: string;
    name: string;
    description: string;
    tool_scan_information?: ToolScanInformationDTO;
    item_location?: DeliveryLocationDTO;
    timestamp_created: string;
}


export interface CreateItemDTO {
    name: string;
    description: string;
    tool_scan_information?: ToolScanInformationDTO;
    item_location?: DeliveryLocationDTO;
}

export interface ScanItemDTO {
    weight: number;
    volume: number;
}