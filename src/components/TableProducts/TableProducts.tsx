import { Spin, Tooltip } from 'antd';
import cn from 'classnames';
import React, { ReactNode } from 'react';
import { NO_INDEX_SELECTED, PRODUCT_LENGTH_PER_PAGE, ROW_HEIGHT } from '../../global/constants';
import { useCurrentTransaction } from '../../hooks/useCurrentTransaction';
import { calculateTableHeight } from '../../utils/function';
import './style.scss';

interface Column {
	name: string | ReactNode;
	width?: string;
	rightAligned?: boolean;
	tooltip?: string;
	loading?: boolean;
	alignment?: string;
}

interface Props {
	columns: Column[];
	data: any;
	activeRow?: number;
	onHover: any;
	onExit: any;
	loading?: any;
}

export const TableProducts = ({ columns, data, activeRow, onHover, onExit, loading }: Props) => {
	// CUSTOM HOOKS
	const { pageNumber } = useCurrentTransaction();

	// METHODS
	const getStyleAlignment = (alignment) =>
		({
			textAlign: alignment || 'left',
		} as React.CSSProperties);

	return (
		<Spin size="large" spinning={loading}>
			<div
				className="TableProducts"
				style={{ height: calculateTableHeight(data?.length + 1) + 25 }}
			>
				{!data.length && (
					<img src={require('../../assets/images/logo.jpg')} alt="logo" className="placeholder" />
				)}

				<table>
					<thead>
						<tr>
							{columns.map(({ name, width, alignment, tooltip = null }, index) => (
								<th key={`th-${index}`} style={{ width, ...getStyleAlignment(alignment) }}>
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
									<td key={`td-${index}`} style={getStyleAlignment(columns?.[index]?.alignment)}>
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

TableProducts.defaultProps = {
	activeRow: NO_INDEX_SELECTED,
};
