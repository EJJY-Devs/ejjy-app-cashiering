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
						startSession({
							...data,
							branch_machine_mac_address: 'test1',
						});
					}}
					loading={status === request.REQUESTING}
					errors={errors}
				/>
			</Box>
		</section>
	);
};

export default Login;
