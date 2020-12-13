import { message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { ControlledInput } from '../../../../components/elements';
import { request } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useTransactions } from '../../../../hooks/useTransactions';
import './style.scss';

interface Props {
	visible: boolean;
	closeModal: any;
}

export const SearchTransaction = ({ visible, closeModal }: Props) => {
	const { getTransaction, status: transactionsStatus } = useTransactions();
	const { setCurrentTransaction } = useCurrentTransaction();
	const { branchProducts } = useBranchProducts();

	const [searchedKey, setSearchedKey] = useState('');

	useEffect(() => {
		setSearchedKey('');
	}, [visible]);

	const onSearch = () => {
		if (!searchedKey.length) {
			message.error('Please input a tranasction id.');
			return;
		}

		getTransaction(searchedKey, ({ status, transaction }) => {
			if (status === request.SUCCESS) {
				setCurrentTransaction({ transaction, branchProducts });
				closeModal();
			} else if (status === request.ERROR) {
				message.error('Cannot find transaction.');
			}
		});
	};

	return (
		<Spin size="large" spinning={transactionsStatus === request.REQUESTING}>
			<KeyboardEventHandler
				handleKeys={['enter']}
				onKeyEvent={(key, e) => {
					if (key === 'enter') {
						onSearch();
					}
				}}
				isDisabled={!searchedKey.length}
			>
				<ControlledInput
					type="number"
					classNames="transaction-search-input"
					value={searchedKey}
					onChange={(value) => setSearchedKey(value)}
					placeholder="Search transaction"
				/>
			</KeyboardEventHandler>
		</Spin>
	);
};
