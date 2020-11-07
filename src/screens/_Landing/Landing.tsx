/* eslint-disable react-hooks/exhaustive-deps */
import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './style.scss';

const Landing = () => {
	const history = useHistory();

	useEffect(() => {
		history.replace('/');
	}, []);

	return (
		<section className="Landing">
			<Spin size="large" tip="Fetching data..." />
		</section>
	);
};

export default Landing;
