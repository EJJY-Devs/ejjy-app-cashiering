import { Divider } from 'antd';
import React, { useState } from 'react';
import { Box, Button } from '../../components/elements';
import { ReportAccessModal } from './components/ReportAccessModal';
import './style.scss';

const Reports = () => {
	const [reportAccessModalVisible, setReportAccessModalVisible] = useState(false);

	return (
		<section className="Reports">
			<Box className="container">
				<h3 className="title">REPORTS</h3>

				<Divider />

				<Button
					text="Generate XRead Report"
					variant="primary"
					block
					onClick={() => setReportAccessModalVisible(true)}
				/>

				<Button
					classNames="space-top"
					text="Generate ZRead Report"
					variant="primary"
					onClick={() => setReportAccessModalVisible(true)}
					block
				/>
			</Box>

			<ReportAccessModal
				visible={reportAccessModalVisible}
				onClose={() => setReportAccessModalVisible(false)}
			/>
		</section>
	);
};

export default Reports;
