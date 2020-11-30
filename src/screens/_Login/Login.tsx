import React from 'react';
import { Box } from '../../components/elements';
import { request } from '../../global/types';
import { useSession } from '../../hooks/useSession';
import { ILoginValues, LoginForm } from './components/LoginForm';
import './style.scss';

const Login = () => {
	const { startSession, status, errors } = useSession();

	return (
		<section className="Login">
			<Box className="container">
				<img src={require('../../assets/images/logo.jpg')} alt="logo" className="logo" />

				<LoginForm
					onSubmit={(data: ILoginValues) => {
						const branchMachineMacAddress = localStorage.getItem('EJJY_MACHINE_ID') || null;
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
			</Box>
		</section>
	);
};

export default Login;
