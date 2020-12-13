import { Divider } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button } from '../../components/elements';
import { request } from '../../global/types';
import { useSession } from '../../hooks/useSession';
import { ILoginValues, LoginForm } from './components/LoginForm';
import { RegisterModal } from './components/RegisterModal';
import './style.scss';

const Login = () => {
	const { startSession, status, errors } = useSession();

	const [registerModalVisible, setRegisterModalVisible] = useState(false);

	return (
		<section className="Login">
			<Box className="container">
				<img src={require('../../assets/images/logo.jpg')} alt="logo" className="logo" />

				<LoginForm
					onSubmit={(data: ILoginValues) => {
						const branchMachineMacAddress =
							localStorage.getItem('EJJY_MACHINE_ID') || '14:7d:da:18:06:61';
						startSession({
							...data,
							branch_machine_mac_address: branchMachineMacAddress,
						});

						// if (branchMachineMacAddress) {
						// 	startSession({
						// 		...data,
						// 		branch_machine_mac_address: branchMachineMacAddress,
						// 	});
						// } else {
						// 	message.error(
						// 		'No machine ID set yet. Please contact your developer for the assistance.',
						// 	);
						// }
					}}
					loading={status === request.REQUESTING}
					errors={errors}
				/>

				<Divider />

				<Button
					text="Register Machine"
					variant="dark-gray"
					onClick={() => setRegisterModalVisible(true)}
					block
				/>
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
