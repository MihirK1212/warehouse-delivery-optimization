import { DeliveryTask } from "@/types/delivery/type";

export default function RiderDeliveriesStatInfo({tasks}: {tasks: DeliveryTask[]}) {

    const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const dispatchedTasks = tasks.filter(task => task.status === 'dispatched');

	return <div>{/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                        Total Assigned
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                        {tasks.length}
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
                        Pending Start
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                        {dispatchedTasks.length}
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
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                    </svg>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                        In Progress
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                        {inProgressTasks.length}
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
                        {completedTasks.length}
                    </p>
                </div>
            </div>
        </div>
    </div></div>;
}