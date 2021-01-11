import * as React from 'react';
import './style.scss';
import cn from 'classnames';
import { Spin, Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { TooltipPlacement } from 'antd/lib/tooltip';

const loadingIcon = <LoadingOutlined style={{ fontSize: 17, color: 'white' }} spin />;

interface Props {
	text: string | React.ReactNode;
	variant: 'primary' | 'secondary' | 'default' | 'dark-gray';
	size: 'md' | 'lg';
	onClick?: any;
	type?: 'button' | 'submit' | 'reset';
	icon?: any;
	iconDirection?: 'left' | 'right';
	loading?: boolean;
	disabled?: boolean;
	block?: boolean;
	classNames?: any;
	tooltipPlacement?: TooltipPlacement;
	tooltip?: string;
	hasShortcutKey?: boolean;
}

const Button = ({
	text,
	variant,
	onClick,
	type,
	icon,
	iconDirection,
	block,
	loading,
	disabled,
	classNames,
	tooltipPlacement,
	tooltip,
	size,
	hasShortcutKey,
}: Props) => (
	<Tooltip placement={tooltipPlacement} title={tooltip} overlayClassName="button-tooltip">
		<button
			type={type}
			className={cn('Button', classNames, {
				[variant]: true,
				[size]: true,
				flex: !!icon,
				hasShortcutKey,
				block,
				disabled,
				loading,
			})}
			onClick={disabled ? null : onClick}
		>
			{loading ? (
				<Spin indicator={loadingIcon} className="spinner" />
			) : (
				<>
					{iconDirection === 'left' && <div className="icon-left">{icon}</div>}
					{text}
					{iconDirection === 'right' && <div className="icon-right">{icon}</div>}
				</>
			)}
		</button>
	</Tooltip>
);

Button.defaultProps = {
	tooltipPlacement: 'top',
	type: 'button',
	onClick: null,
	variant: 'default',
	size: 'md',
	iconDirection: null,
};

export default Button;
