import { Spin, Tooltip } from 'antd';
import cn from 'classnames';
import React, { ReactNode, useEffect, useRef } from 'react';
import { NO_INDEX_SELECTED, ROW_HEIGHT } from '../../global/constants';
import { calculateTableHeight } from '../../utils/function';
import './style.scss';

interface Column {
	name: string | ReactNode;
	width?: string;
	rightAligned?: boolean;
	tooltip?: string;
	loading?: boolean;
}

interface Props {
	columns: Column[];
	data: any;
	activeRow?: number;
	loading?: any;
}

export const TableQueue = ({ columns, data, activeRow, loading }: Props) => {
	const itemRefs = useRef([]);

	// Effect: Focus active item
	useEffect(() => {
		if (activeRow !== NO_INDEX_SELECTED) {
			itemRefs.current?.[activeRow]?.focus();
		}
	}, [activeRow]);

	return (
		<Spin size="large" spinning={loading}>
			<div className="TableQueue" style={{ height: calculateTableHeight(data?.length + 1) + 25 }}>
				<table>
					<thead>
						<tr>
							{columns.map(({ name, width, rightAligned = false, tooltip = null }, index) => (
								<th
									key={`th-${index}`}
									style={{ width, textAlign: rightAligned ? 'right' : 'left' }}
								>
									{tooltip ? <Tooltip title={tooltip}>{name}</Tooltip> : name}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data?.map((row, index) => (
							<tr
								ref={(el) => (itemRefs.current[index] = el)}
								tabIndex={index}
								className={cn({ active: activeRow === index })}
								key={`tr-${index}`}
								style={{ height: `${ROW_HEIGHT}px` }}
							>
								{row.map((item, index) => (
									<td
										key={`td-${index}`}
										style={{ textAlign: columns?.[index].rightAligned ? 'right' : 'left' }}
									>
										{item}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Spin>
	);
};

TableQueue.defaultProps = {
	activeRow: NO_INDEX_SELECTED,
};
