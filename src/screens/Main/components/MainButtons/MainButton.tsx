import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import cn from 'classnames';
import React from 'react';
import './style.scss';

interface Props {
	title: string;
	onClick: any;
	classNames?: string;
	disabled?: boolean;
	loading?: boolean;
}

const loadingIcon = (
	<LoadingOutlined style={{ fontSize: 17, color: 'rgba(35, 37, 46, 0.85)' }} spin />
);

export const MainButton = ({ title, onClick, classNames, disabled, loading }: Props) => (
	<button
		className={cn('MainButton', classNames, { disabled: disabled || loading })}
		onClick={onClick}
	>
		{loading ? <Spin indicator={loadingIcon} className="spinner" /> : title}
	</button>
);
