import { Layout, Spin } from 'antd';
import React, { ReactNode } from 'react';
import './style.scss';

const { Content } = Layout;

interface Props {
	children?: ReactNode;
	loadingText?: string;
	loading?: boolean;
}

export const Container = ({ loading, loadingText, children }: Props) => {
	return (
		<Layout className="Main">
			<Spin size="large" spinning={loading} tip={loadingText} className="container-spinner">
				<Layout className="site-layout">
					<Content className="page-content">{children}</Content>
				</Layout>
			</Spin>
		</Layout>
	);
};

Container.defaultProps = {
	loading: false,
	loadingText: 'Fetching data...',
};
