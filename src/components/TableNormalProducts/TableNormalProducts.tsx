import { Spin, Tooltip } from 'antd';
import cn from 'classnames';
import React, { ReactNode } from 'react';
import { NO_INDEX_SELECTED, PRODUCT_LENGTH_PER_PAGE } from '../../global/constants';
import { useCurrentTransaction } from '../../hooks/useCurrentTransaction';
import { calculateTableHeight } from '../../utils/function';
import { ROW_HEIGHT } from '../Table/Table';
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
	onHover: any;
	onExit: any;
	loading?: any;
}

export const TableNormalProducts = ({
	columns,
	data,
	activeRow,
	onHover,
	onExit,
	loading,
}: Props) => {
	const { pageNumber } = useCurrentTransaction();

	return (
		<Spin size="large" spinning={loading}>
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
								className={cn({
									active: activeRow === (pageNumber - 1) * PRODUCT_LENGTH_PER_PAGE + index,
								})}
								key={`tr-${index}`}
								style={{ height: `${ROW_HEIGHT}px` }}
								onMouseEnter={() => onHover(index)}
								onMouseLeave={() => onExit()}
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

TableNormalProducts.defaultProps = {
	activeRow: NO_INDEX_SELECTED,
};
