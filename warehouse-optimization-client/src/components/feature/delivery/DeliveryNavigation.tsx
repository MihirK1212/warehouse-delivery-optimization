import { DeliveryLocation, RouteSegment } from "@/types/common/type";
import _ from "lodash";
import { useState } from "react";


export default function DeliveryNavigation({
	deliveryStartLocation,
	deliveryEndLocation,
	taskRoute,
}: {
	deliveryStartLocation?: DeliveryLocation;
	deliveryEndLocation?: DeliveryLocation;
	taskRoute: RouteSegment[];
}) {
    // for now ignore the taskRoute - we will use the deliveryStartLocation and deliveryEndLocation only to directly display the route on the map
    
    const deliveryStartCoordinate = deliveryStartLocation?.coordinate;
    const deliveryEndCoordinate = deliveryEndLocation?.coordinate;

    if (!deliveryStartCoordinate || !deliveryEndCoordinate) {
        return <div>No route found - please check the route</div>;
    }

	return <div>
		<div>
			<h3>{deliveryStartCoordinate.latitude}, {deliveryStartCoordinate.longitude}</h3>
			<h3>{deliveryEndCoordinate.latitude}, {deliveryEndCoordinate.longitude}</h3>
		</div>
	</div>;
}