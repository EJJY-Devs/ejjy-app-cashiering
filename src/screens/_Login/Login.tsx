import { Divider, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button } from '../../components/elements';
import { SettingUrlModal } from '../../components/SettingUrl/SettingUrlModal';
import { request } from '../../global/types';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentTransaction } from '../../hooks/useCurrentTransaction';
import { useSession } from '../../hooks/useSession';
import {
	getBranchMachineCount,
	getBranchMachineId,
	getKeyDownCombination,
} from '../../utils/function';
import ButtonClose from './components/ButtonClose';
import { ILoginValues, LoginForm } from './components/LoginForm';
import { RegisterModal } from './components/RegisterModal';
import './style.scss';

const Login = () => {
	// STATES
	const [registerModalVisible, setRegisterModalVisible] = useState(false);
	const [urlModalVisible, setUrlModalVisible] = useState(false);
	const [areSetupButtonsVisible, setSetupButtonsVisible] = useState(false);

	// CUSTOM HOOKS
	const { startSession, status, errors } = useSession();
	const { localIpAddress } = useAuth();
	const { setPreviousChange } = useCurrentTransaction();

	// METHODS
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	useEffect(() => {
		const branchMachineId = getBranchMachineId();
		setSetupButtonsVisible(!(branchMachineId && localIpAddress));
	}, [localIpAddress]);

	const onStartSession = (data: ILoginValues) => {
		const branchMachineId = getBranchMachineId();
		const branchMachineCount = getBranchMachineCount();

		if (data.login !== 'specialpersonnel' && !branchMachineId) {
			message.error('Machine is not yet registered.');
			return;
		}

		startSession({
			...data,
			branch_machine_id: data.login === 'specialpersonnel' ? 1 : branchMachineId,
			branch_machine_registration_count: data.login === 'specialpersonnel' ? 1 : branchMachineCount,
		});

		setPreviousChange(null);
	};

	const handleKeyDown = (event) => {
		const key = getKeyDownCombination(event);

		if (['meta+s', 'ctrl+s'].includes(key)) {
			setSetupButtonsVisible((value) => !value);
		}
	};

	return (
		<section className="Login">
			<ButtonClose onClick={() => window.close()} />

			<Box className="container">
				<img src={require('../../assets/images/logo.jpg')} alt="logo" className="logo" />

				<LoginForm
					onSubmit={onStartSession}
					loading={status === request.REQUESTING}
					errors={errors}
					shouldFullScreen
				/>

				<Divider />

				{areSetupButtonsVisible && (
					<div className="setup-buttons">
						<Button
							classNames="btn-set-api-url"
							text="1. Set API URL"
							variant="dark-gray"
							onClick={() => setUrlModalVisible(true)}
							block
						/>

						<Button
							classNames="btn-register-machine"
							text="2. Register Machine"
							variant="dark-gray"
							onClick={() => setRegisterModalVisible(true)}
							block
						/>
					</div>
				)}

				<Link to="/reports" className="btn-reports">
					<Button text="Reports" variant="dark-gray" block />
				</Link>
			</Box>

			<SettingUrlModal visible={urlModalVisible} onClose={() => setUrlModalVisible(false)} />

			<RegisterModal
				visible={registerModalVisible}
				onClose={() => setRegisterModalVisible(false)}
			/>
		</section>
	);
};

export default Login;
