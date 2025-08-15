export type ToolScanInformation = {
    volume: number;
    weight: number;
    timestamp: string;
}

export type Coordinate = {
    latitude: number;
    longitude: number;
}

export type DeliveryLocation = {        
    address: string;
    coordinate: Coordinate;
}

export type RouteSegment = {
    distance: number;
    timeTaken: number;
    instruction: string;
    polyline: Coordinate[];
}

export type DeliveryInformation = {
    expectedDeliveryTime: moment.Moment;
    deliveryType: string;
    awbId: string;
    deliveryLocation: DeliveryLocation;
}