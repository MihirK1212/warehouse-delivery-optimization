export default function DispatchStats({
	pendingCount,
	selectedTasksCount,
	availableRidersCount,
	totalVolume,
}: {
	pendingCount: number;
	selectedTasksCount: number;
	availableRidersCount: number;
	totalVolume: number;
}) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
							Pending Dispatch
						</p>
						<p className="text-2xl font-semibold text-gray-900">
							{pendingCount}
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
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<div className="ml-4">
						<p className="text-sm font-medium text-gray-600">
							Selected Tasks
						</p>
						<p className="text-2xl font-semibold text-gray-900">
							{selectedTasksCount}
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
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
					</div>
					<div className="ml-4">
						<p className="text-sm font-medium text-gray-600">
							Available Riders
						</p>
						<p className="text-2xl font-semibold text-gray-900">
							{availableRidersCount}
						</p>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex items-center">
					<div className="p-2 bg-purple-100 rounded-lg">
						<svg
							className="w-8 h-8 text-purple-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
							/>
						</svg>
					</div>
					<div className="ml-4">
						<p className="text-sm font-medium text-gray-600">
							Total Volume
						</p>
						<p className="text-2xl font-semibold text-gray-900">
							{totalVolume.toFixed(1)}L
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
