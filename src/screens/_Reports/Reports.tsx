import { Divider, message } from 'antd';
import React, { useState } from 'react';
import { Box, Button } from '../../components/elements';
import { reportTypes } from '../../global/types';
import { getBranchMachineId } from '../../utils/function';
import { ReportAccessModal } from './components/ReportAccessModal';
import { ViewXreadReportModal } from './components/ViewXreadReportModal';
import { ViewZreadReportModal } from './components/ViewZreadReportModal';
import './style.scss';

const Reports = () => {
	const [selectedReportType, setSelectedReportType] = useState(null);
	const [reportAccessModalVisible, setReportAccessModalVisible] = useState(false);
	const [xreadReportModalVisible, setXreadReportModalVisible] = useState(false);
	const [zreadReportModalVisible, setZreadReportModalVisible] = useState(false);
	const [xreadReport, setXreadReport] = useState(null);
	const [zreadReport, setZreadReport] = useState(null);

	const onGenerateReadReport = (type) => {
		const branchMachineId = getBranchMachineId();

		if (!branchMachineId) {
			message.error('This machine is not yet registered.');
			return;
		}

		setSelectedReportType(type);
		setReportAccessModalVisible(true);
	};

	const onSuccess = (report) => {
		if (selectedReportType === reportTypes.XREAD) {
			setXreadReport(report);
			setXreadReportModalVisible(true);
		} else if (selectedReportType === reportTypes.ZREAD) {
			setZreadReport(report);
			setZreadReportModalVisible(true);
		}
	};

	return (
		<section className="Reports">
			<Box className="container">
				<h3 className="title">REPORTS</h3>

				<Divider />

				<Button
					text="Generate XRead Report"
					variant="primary"
					block
					onClick={() => onGenerateReadReport(reportTypes.XREAD)}
				/>

				<Button
					classNames="space-top"
					text="Generate ZRead Report"
					variant="primary"
					onClick={() => onGenerateReadReport(reportTypes.ZREAD)}
					block
				/>
			</Box>

			<ViewXreadReportModal
				visible={xreadReportModalVisible}
				report={xreadReport}
				onClose={() => setXreadReportModalVisible(false)}
			/>

			<ViewZreadReportModal
				visible={zreadReportModalVisible}
				report={zreadReport}
				onClose={() => setZreadReportModalVisible(false)}
			/>

			<ReportAccessModal
				reportType={selectedReportType}
				visible={reportAccessModalVisible}
				onSuccess={onSuccess}
				onClose={() => setReportAccessModalVisible(false)}
			/>
		</section>
	);
};

export default Reports;
