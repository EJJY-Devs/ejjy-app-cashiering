import { Layout, Spin } from 'antd';
import cn from 'classnames';
import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { selectors as uiSelectors } from '../../ducks/ui';
import './style.scss';

const { Content } = Layout;

interface Props {
	children?: ReactNode;
	loadingText?: string;
	loading?: boolean;
}

export const Container = ({ loading, loadingText, children }: Props) => {
	const isSidebarCollapsed = useSelector(uiSelectors.selectIsSidebarCollapsed());

	return (
		<Layout className={cn('Main', { 'sidebar-collapsed': isSidebarCollapsed })}>
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
