export interface ToolScanInformationDTO {
    volume: number;
    weight: number;
    timestamp: string;
}

export interface CoordinateDTO {
    latitude: number;
    longitude: number;
}

export interface DeliveryLocationDTO {        
    address: string;
    coordinate: CoordinateDTO;
}

export interface RouteSegmentDTO {
    start_location: DeliveryLocationDTO;
    end_location: DeliveryLocationDTO;
    distance: number;
    time_taken: number;
    instruction: string;
    polyline: CoordinateDTO[];
}

export interface DeliveryInformationDTO {
    expected_delivery_time: string;
    delivery_type: string;
    awb_id: string;
    delivery_location: DeliveryLocationDTO;
}