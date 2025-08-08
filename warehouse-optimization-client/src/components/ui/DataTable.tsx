"use client";

import { useMemo, useState } from "react";

interface Column<T> {
	key: keyof T;
	header: string;
	render?: (value: T[keyof T], row: T) => React.ReactNode;
	sortable?: boolean;
	width?: string;
}

interface DataTableProps<T> {
	data: T[];
	columns: Column<T>[];
	onRowSelect?: (selectedRows: T[]) => void;
	selectable?: boolean;
	loading?: boolean;
	emptyMessage?: string;
	className?: string;
	selectedItems?: T[];
}

export default function DataTable<T extends Record<string, unknown>>({
	data,
	columns,
	onRowSelect,
	selectable = false,
	loading = false,
	emptyMessage = "No data available",
	className = "",
	selectedItems = [],
}: DataTableProps<T>) {
	const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

	const handleSort = (column: keyof T) => {
		if (sortColumn === column) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortColumn(column);
			setSortDirection("asc");
		}
	};

	const sortedData = [...data].sort((a, b) => {
		if (!sortColumn) return 0;

		const aValue = a[sortColumn] as string | number;
		const bValue = b[sortColumn] as string | number;

		if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
		if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
		return 0;
	});

	const selectedRows = useMemo(
		() =>
			new Set(
				sortedData
					.map((item, index) =>
						selectedItems.includes(item) ? index : -1
					)
					.filter((index) => index !== -1)
			),
		[selectedItems, sortedData]
	);

	const handleRowSelect = (index: number) => {
		const newSelectedRows = new Set(selectedRows);
		if (newSelectedRows.has(index)) {
			newSelectedRows.delete(index);
		} else {
			newSelectedRows.add(index);
		}

		if (onRowSelect) {
			const selectedData = Array.from(newSelectedRows).map(
				(i) => sortedData[i]
			);
			onRowSelect(selectedData);
		}
	};

	const handleSelectAll = () => {
		if (selectedRows.size === sortedData.length) {
			if (onRowSelect) {
				onRowSelect([]);
			}
		} else {
			if (onRowSelect) {
				onRowSelect(sortedData);
			}
		}
	};

	if (loading) {
		return (
			<div className={`bg-white shadow rounded-lg ${className}`}>
				<div className="p-8 text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<p className="mt-2 text-gray-500">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`bg-white shadow rounded-lg overflow-hidden ${className}`}
		>
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							{selectable && (
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									<input
										type="checkbox"
										checked={
											selectedRows.size ===
												sortedData.length &&
											sortedData.length > 0
										}
										onChange={handleSelectAll}
										className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
									/>
								</th>
							)}
							{columns.map((column) => (
								<th
									key={String(column.key)}
									className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
										column.sortable
											? "cursor-pointer hover:bg-gray-100"
											: ""
									} ${column.width ? column.width : ""}`}
									onClick={() =>
										column.sortable &&
										handleSort(column.key)
									}
								>
									<div className="flex items-center space-x-1">
										<span>{column.header}</span>
										{column.sortable && (
											<div className="flex flex-col">
												<svg
													className={`w-3 h-3 ${
														sortColumn ===
															column.key &&
														sortDirection === "asc"
															? "text-blue-600"
															: "text-gray-400"
													}`}
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fillRule="evenodd"
														d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
														clipRule="evenodd"
													/>
												</svg>
												<svg
													className={`w-3 h-3 ${
														sortColumn ===
															column.key &&
														sortDirection === "desc"
															? "text-blue-600"
															: "text-gray-400"
													}`}
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fillRule="evenodd"
														d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
														clipRule="evenodd"
													/>
												</svg>
											</div>
										)}
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{sortedData.length === 0 ? (
							<tr>
								<td
									colSpan={
										columns.length + (selectable ? 1 : 0)
									}
									className="px-6 py-8 text-center text-gray-500"
								>
									{emptyMessage}
								</td>
							</tr>
						) : (
							sortedData.map((row, index) => (
								<tr
									key={index}
									className={`hover:bg-gray-50 ${
										selectedRows.has(index)
											? "bg-blue-50"
											: ""
									}`}
								>
									{selectable && (
										<td className="px-6 py-4 whitespace-nowrap">
											<input
												type="checkbox"
												checked={selectedRows.has(
													index
												)}
												onChange={() =>
													handleRowSelect(index)
												}
												className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
											/>
										</td>
									)}
									{columns.map((column) => (
										<td
											key={String(column.key)}
											className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
										>
											{column.render
												? column.render(
														row[column.key],
														row
												  )
												: String(row[column.key] ?? "")}
										</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
