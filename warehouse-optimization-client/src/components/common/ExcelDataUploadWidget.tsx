import { useState } from "react";
import ExcelUpload from "./ExcelUpload";
import Alert from "./Alert";
import DataTable from "./DataTable";
import LoadingSpinner from "./LoadingSpinner";
import { Column } from "@/types/excel";

export default function ExcelDataUploadWidget<
	TExcelData extends Record<string, unknown>
>({
	templateNameKey,
	expectedUploadColumnNames,
	dataDisplayColumns,
	onSubmit,
}: {
	templateNameKey: string;
	expectedUploadColumnNames: string[];
	dataDisplayColumns: Column<TExcelData>[];
	onSubmit: (data: TExcelData[]) => Promise<void>;
}) {
	const [parsedData, setParsedData] = useState<TExcelData[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	const handleDataParsed = (data: TExcelData[]) => {
		setParsedData(data);
		setSubmitStatus(null);
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		setSubmitStatus(null);

		try {
			await onSubmit(parsedData);
			setSubmitStatus({
				type: "success",
				message: `Successfully added ${parsedData.length} data`,
			});
			setParsedData([]);

			setTimeout(() => {
				setSubmitStatus(null);
			}, 2000);
		} catch (error) {
			setSubmitStatus({
				type: "error",
				message: "Failed to create data",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-6">
			<ExcelUpload
				onDataParsed={handleDataParsed}
				expectedColumns={expectedUploadColumnNames}
				templateName={templateNameKey}
			/>

			{submitStatus && (
				<Alert type={submitStatus.type}>{submitStatus.message}</Alert>
			)}

			{parsedData.length > 0 && (
				<div className="space-y-4">
					<h4 className="text-lg font-medium text-gray-900">
						Preview ({parsedData.length} items)
					</h4>

					<DataTable
						data={parsedData}
						columns={dataDisplayColumns}
						className="max-h-64 overflow-y-auto"
					/>

					<div className="flex justify-end space-x-3">
						<button
							onClick={() => setParsedData([])}
							className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
							disabled={isSubmitting}
						>
							Clear
						</button>
						<button
							onClick={handleSubmit}
							disabled={isSubmitting}
							className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting && (
								<LoadingSpinner size="sm" className="mr-2" />
							)}
							{isSubmitting
								? "Creating Data..."
								: "Create Data"}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
