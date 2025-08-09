import { useMemo } from "react";
import { DeliveryTask } from "@/types/delivery/type";

export default function PickupStats({
	pickupTasks,
}: {
	pickupTasks: DeliveryTask[];
}) {
	const undispatchedPickups = useMemo(
		() =>
			pickupTasks.filter((task) => task.status === "undispatched").length,
		[pickupTasks]
	);
	const inProgressPickups = useMemo(
		() =>
			pickupTasks.filter((task) => task.status === "in_progress").length,
		[pickupTasks]
	);
	const completedPickups = useMemo(
		() => pickupTasks.filter((task) => task.status === "completed").length,
		[pickupTasks]
	);
	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center">
						<div className="p-2 bg-orange-100 rounded-lg">
							<svg
								className="w-8 h-8 text-orange-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								/>
							</svg>
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-gray-600">
								Total Pickups
							</p>
							<p className="text-2xl font-semibold text-gray-900">
								{pickupTasks.length}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center">
						<div className="p-2 bg-yellow-100 rounded-lg">
							<svg
								className="w-8 h-8 text-yellow-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-gray-600">
								Pending
							</p>
							<p className="text-2xl font-semibold text-gray-900">
								{undispatchedPickups}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center">
						<div className="p-2 bg-blue-100 rounded-lg">
							<svg
								className="w-8 h-8 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-gray-600">
								In Progress
							</p>
							<p className="text-2xl font-semibold text-gray-900">
								{inProgressPickups}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center">
						<div className="p-2 bg-green-100 rounded-lg">
							<svg
								className="w-8 h-8 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-gray-600">
								Completed
							</p>
							<p className="text-2xl font-semibold text-gray-900">
								{completedPickups}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
