import { Rider } from "@/types/rider/type";

export default function RiderProfileHeader({ rider, onLogout }: { rider: Rider, onLogout: () => void }) {
	return (
		<div>
			<div className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-6">
						<div className="flex items-center">
							<h1 className="text-3xl font-bold text-gray-900">
								Rider Dashboard
							</h1>
							<span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
								{rider?.name}
							</span>
							<span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
								{rider?.phoneNumber}
							</span>
						</div>
						<div className="flex items-center space-x-4">
							<div className="text-sm text-gray-500">
								View and manage your assigned deliveries
							</div>
							<button
								onClick={onLogout}
								className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
							>
								<svg
									className="w-4 h-4 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
									/>
								</svg>
								Logout
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
