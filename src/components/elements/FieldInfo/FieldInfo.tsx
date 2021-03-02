import { InfoCircleOutlined } from '@ant-design/icons';
import cn from 'classnames';
import * as React from 'react';
import './style.scss';

interface Props {
	info: string;
	type: 'small' | 'large';
}

const FieldInfo = ({ info, type }: Props) => (
	<div className={cn('FieldInfo', type)}>
		<InfoCircleOutlined className="icon" />
		<span className="text">{info}</span>
	</div>
);

FieldInfo.defaultProps = {
	type: 'small',
};

export default FieldInfo;
