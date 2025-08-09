export class DeliveryStatus {
	readonly name: string;
	readonly description: string;
	readonly rank: number;

	private static readonly _allStatuses: DeliveryStatus[] = [];

	private constructor(name: string, description: string, rank: number) {
		this.name = name;
		this.description = description;
		this.rank = rank;
		DeliveryStatus._allStatuses.push(this);
	}

	// Enum-like static instances
	static readonly UNDISPATCHED = new DeliveryStatus(
		"undispatched",
		"The delivery is not dispatched yet",
		0
	);
	static readonly DISPATCHING = new DeliveryStatus(
		"dispatching",
		"The delivery is being dispatched",
		1
	);
	static readonly DISPATCHED = new DeliveryStatus(
		"dispatched",
		"The delivery is dispatched",
		2
	);
	static readonly IN_PROGRESS = new DeliveryStatus(
		"in_progress",
		"The delivery is in progress",
		3
	);
	static readonly COMPLETED = new DeliveryStatus(
		"completed",
		"The delivery is completed",
		4
	);
	static readonly CANCELLED = new DeliveryStatus(
		"cancelled",
		"The delivery is cancelled",
		5
	);

	// Method to get next rank status
	getNextRankStatus(): DeliveryStatus | null {
		return (
			DeliveryStatus._allStatuses.find(
				(status) => status.rank === this.rank + 1
			) || null
		);
	}

    // Get the color of the status
	getStatusColor(): string {
		switch (this) {
			case DeliveryStatus.DISPATCHED:
				return "bg-blue-100 text-blue-800 border-blue-200";
			case DeliveryStatus.IN_PROGRESS:
				return "bg-purple-100 text-purple-800 border-purple-200";
			case DeliveryStatus.COMPLETED:
				return "bg-green-100 text-green-800 border-green-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	}

    // Get the label of the next status
    getNextStatusLabel(): string | null {
        switch (this) {
          case DeliveryStatus.DISPATCHED:
            return 'Start Delivery';
          case DeliveryStatus.IN_PROGRESS:
            return 'Mark Complete';
          default:
			return 'Update to next status';
		}
	}

	// Optional: get all statuses
	static values(): DeliveryStatus[] {
		return [...DeliveryStatus._allStatuses];
	}
}
