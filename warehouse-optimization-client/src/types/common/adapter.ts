import { RouteSegmentDTO } from "./dto";
import { RouteSegment } from "../common/type";

export const routeSegmentAdapter = (
	routeSegment: RouteSegmentDTO
): RouteSegment => {
	return {
		startLocation: routeSegment.start_location,
		endLocation: routeSegment.end_location,
		distance: routeSegment.distance,
		timeTaken: routeSegment.time_taken,
		instruction: routeSegment.instruction,
		polyline: routeSegment.polyline,
	};
};
