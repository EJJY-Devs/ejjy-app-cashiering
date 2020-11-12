import { Col, Row } from 'antd';
import React, { ReactNode } from 'react';
import { Label } from '../elements';

interface Props {
	value: string | number | ReactNode;
	label: string;
	classNamesLabel?: string;
	classNamesValue?: string;
}

export const DetailsSingle = ({ value, label, classNamesLabel, classNamesValue }: Props) => {
	return (
		<Col span={24}>
			<Row gutter={{ sm: 15, xs: 0 }}>
				<Col sm={8} xs={24}>
					<Label classNames={classNamesLabel} label={label} />
				</Col>
				<Col sm={16} xs={24}>
					<span className={classNamesValue}>{value}</span>
				</Col>
			</Row>
		</Col>
	);
};
