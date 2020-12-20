import { Divider, message } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button } from '../../components/elements';
import { request } from '../../global/types';
import { useCurrentTransaction } from '../../hooks/useCurrentTransaction';
import { useSession } from '../../hooks/useSession';
import { getBranchMachineId } from '../../utils/function';
import { ILoginValues, LoginForm } from './components/LoginForm';
import { RegisterModal } from './components/RegisterModal';
import './style.scss';

const Login = () => {
	const { startSession, status, errors } = useSession();
	const { setPreviousSukli } = useCurrentTransaction();

	const [registerModalVisible, setRegisterModalVisible] = useState(false);

	const onStartSession = (data: ILoginValues) => {
		const branchMachineId = getBranchMachineId();
		if (data.login !== 'specialpersonnel' && !branchMachineId) {
			message.error('Machine is not yet registered.');
			return;
		}

		startSession({
			...data,
			branch_machine_id: data.login === 'specialpersonnel' ? 1 : branchMachineId,
		});

		setPreviousSukli(null);
	};

	return (
		<section className="Login">
			<Box className="container">
				<img src={require('../../assets/images/logo.jpg')} alt="logo" className="logo" />

				<LoginForm
					onSubmit={onStartSession}
					loading={status === request.REQUESTING}
					errors={errors}
				/>

				<Divider />

				{!getBranchMachineId() && (
					<Button
						text="Register Machine"
						variant="dark-gray"
						onClick={() => setRegisterModalVisible(true)}
						block
					/>
				)}

				<Link to="/reports" className="btn-reports">
					<Button text="Reports" variant="dark-gray" block />
				</Link>
			</Box>

			<RegisterModal
				visible={registerModalVisible}
				onClose={() => setRegisterModalVisible(false)}
			/>
		</section>
	);
};

export default Login;
