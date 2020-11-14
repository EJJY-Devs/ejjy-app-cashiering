import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import cn from 'classnames';
import React, { ReactNode } from 'react';
import './style.scss';

interface Props {
	icon: ReactNode;
	onClick: any;
	classNames?: string;
	disabled?: boolean;
	loading?: boolean;
}

const loadingIcon = (
	<LoadingOutlined style={{ fontSize: 17, color: 'rgba(35, 37, 46, 0.85)' }} spin />
);

export const NavigationButton = ({ icon, onClick, disabled, classNames, loading }: Props) => (
	<button
		className={cn('NavigationButton', classNames, { disabled: disabled || loading })}
		onClick={onClick}
	>
		{loading ? <Spin indicator={loadingIcon} className="spinner" /> : icon}
	</button>
);
