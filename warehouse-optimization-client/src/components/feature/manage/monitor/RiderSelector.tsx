import { useGetRidersQuery } from "@/store/api/rider";
import { Rider } from "@/types/rider/type";
import _ from "lodash";

interface RiderSelectorProps {
	selectedRiderId: string | null;
	onRiderSelect: (riderId: string | null) => void;
}

export default function RiderSelector({
	selectedRiderId,
	onRiderSelect,
}: RiderSelectorProps) {
	const { data: riders = [], isLoading } = useGetRidersQuery();

	return (
		<div className="w-full max-w-md">
			<label
				htmlFor="rider-select"
				className="block text-sm font-medium text-gray-700 mb-2"
			>
				Select Rider
			</label>
			<select
				id="rider-select"
				value={selectedRiderId || ""}
				onChange={(e) =>
					onRiderSelect(e.target.value ? e.target.value : null)
				}
				className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				disabled={isLoading}
			>
				<option value="">
					{isLoading ? "Loading riders..." : "Select a rider"}
				</option>
				{riders.map((rider: Rider) => (
					<option key={rider.id} value={rider.id}>
						{rider.name} - {rider.phoneNumber}
					</option>
				))}
			</select>
		</div>
	);
}

