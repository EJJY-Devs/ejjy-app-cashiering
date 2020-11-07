import React, { useState } from 'react';
import { OthersModal } from './OthersModal';

interface Props {
	onMidSession: any;
	onEndSession: any;
}

export const MainButtons = ({ onMidSession, onEndSession }: Props) => {
	const [othersModalVisible, setOthersModalVisible] = useState(false);

	const onMidSessionModified = () => {
		onMidSession();
		setOthersModalVisible(false);
	};

	const onEndSessionModified = () => {
		onEndSession();
		setOthersModalVisible(false);
	};

	return (
		<div className="MainButtons">
			<div className="store-info-wrapper">
				<div className="item">
					<p className="label">Branch</p>
					<p className="value">Branch Name</p>
				</div>

				<div className="item">
					<p className="label">Machine</p>
					<p className="value">Machine Name</p>
				</div>
			</div>

			<div className="buttons-wrapper">
				<button className="btn-hold">Hold</button>
				<button className="btn-discount">Discount</button>
				<button className="btn-reset">Reset</button>
				<button className="btn-void">Void</button>
				<button className="btn-others" onClick={() => setOthersModalVisible(true)}>
					Others
				</button>
			</div>

			<OthersModal
				onMidSession={onMidSessionModified}
				onEndSession={onEndSessionModified}
				visible={othersModalVisible}
				onClose={() => setOthersModalVisible(false)}
			/>
		</div>
	);
};
