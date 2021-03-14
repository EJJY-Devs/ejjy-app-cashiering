import { CloseCircleOutlined } from '@ant-design/icons';
import * as React from 'react';
import '../style.scss';

interface Props {
	onClick: any;
}

const ButtonClose = ({ onClick }: Props) => (
	<button className="ButtonClose" onClick={onClick}>
		<CloseCircleOutlined className="icon" />
		<span className="text">EXIT</span>
	</button>
);

export default ButtonClose;
