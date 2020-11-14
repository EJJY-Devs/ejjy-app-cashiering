import { Tooltip } from 'antd';
import React, { ReactNode } from 'react';
import { calculateTableHeight } from '../../utils/function';
import { ROW_HEIGHT } from '../Table/Table';
import './style.scss';

interface Column {
	name: string | ReactNode;
	width?: string;
	center?: boolean;
	tooltip?: string;
}

interface Props {
	columns: Column[];
	data: any;
	onHover: any;
	onExit: any;
}

export const TableNormalProducts = ({ columns, data, onHover, onExit }: Props) => {
	return (
		<div
			className="TableNormalProducts"
			style={{ height: calculateTableHeight(data?.length + 1) + 25 }}
		>
			{!data.length && (
				<img src={require('../../assets/images/logo.jpg')} alt="logo" className="placeholder" />
			)}

			<table>
				<thead>
					<tr>
						{columns.map(({ name, width, center = false, tooltip = null }, index) => (
							<th key={`th-${index}`} style={{ width, textAlign: center ? 'center' : 'left' }}>
								{tooltip ? <Tooltip title={tooltip}>{name}</Tooltip> : name}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data?.map((row, index) => (
						<tr
							key={`tr-${index}`}
							style={{ height: `${ROW_HEIGHT}px` }}
							onMouseEnter={() => onHover(index)}
							onMouseLeave={() => onExit()}
						>
							{row.map((item, index) => (
								<td
									key={`td-${index}`}
									style={{ textAlign: columns?.[index].center ? 'center' : 'left' }}
								>
									{item}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
