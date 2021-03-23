import { message } from 'antd';
import React, { useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { reportTypes } from '../../../../global/types';
import { getBranchMachineId } from '../../../../utils/function';
import { ReportAccessModal } from '../../../_Reports/components/ReportAccessModal';
import { ViewXreadReportModal } from '../../../_Reports/components/ViewXreadReportModal';
import { ViewZreadReportModal } from '../../../_Reports/components/ViewZreadReportModal';

interface Props {
	visible: any;
}

export const OthersReports = ({ visible }: Props) => {
	// STATES
	const [selectedReportType, setSelectedReportType] = useState(null);
	const [reportAccessModalVisible, setReportAccessModalVisible] = useState(false);
	const [xreadReportModalVisible, setXreadReportModalVisible] = useState(false);
	const [zreadReportModalVisible, setZreadReportModalVisible] = useState(false);
	const [xreadReport, setXreadReport] = useState(null);
	const [zreadReport, setZreadReport] = useState(null);

	// METHODS
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

	const handleKeyPress = (key, event) => {
		event.preventDefault();
		event.stopPropagation();

		if (key === 'f9') {
			onGenerateReadReport(reportTypes.XREAD);
		} else if (key === 'f10') {
			onGenerateReadReport(reportTypes.ZREAD);
		}
	};

	return (
		<section className="OthersReports">
			<KeyboardEventHandler
				handleKeys={['f9', 'f10']}
				onKeyEvent={handleKeyPress}
				handleFocusableElements
				isDisabled={!visible}
			/>

			<button className="other-button" onClick={() => onGenerateReadReport(reportTypes.XREAD)}>
				Generate XRead Report
				<span className="shortcut-key position-right text-lg">[F9]</span>
			</button>

			<button
				className="other-button spacing-top"
				onClick={() => onGenerateReadReport(reportTypes.ZREAD)}
			>
				Generate ZRead Report
				<span className="shortcut-key position-right text-lg">[F10]</span>
			</button>

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
