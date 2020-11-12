/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { Container } from '../../../components';
import { types as cashBreakdownsRequestTypes } from '../../../ducks/cash-breakdowns';
import { cashBreakdownTypes, request } from '../../../global/types';
import { useBranchProducts } from '../../../hooks/useBranchProducts';
import { useCashBreakdown } from '../../../hooks/useCashBreakdown';
import { useCurrentTransaction } from '../../../hooks/useCurrentTransaction';
import { useSession } from '../../../hooks/useSession';
import { useTransactions } from '../../../hooks/useTransactions';
import { CashBreakdownModal } from './components/CashBreakdown/CashBreakdownModal';
import { MainButtons } from './components/MainButtons/MainButtons';
import { NavigationButtons } from './components/NavigationButtons/NavigationButtons';
import { Payment } from './components/Payment/Payment';
import { ProductSearch } from './components/ProductSearch/ProductSearch';
import { ProductTable } from './components/ProductTable/ProductTable';
import './style.scss';

const Main = () => {
	const {
		session,
		validateSession,
		endSession,
		invalidSession,
		status: sessionStatus,
	} = useSession();
	const { transactionId, resetTransaction } = useCurrentTransaction();
	const {
		cashBreakdowns,
		listCashBreakdown,
		status: cashBreakdownStatus,
		recentRequest: cashBreakdownRecentRequest,
	} = useCashBreakdown();
	const { listBranchProducts, status: branchProductsStatus } = useBranchProducts();
	const { listTransactions, status: transactionsStatus } = useTransactions();

	// States
	const [requiredCashBreakdown, setRequiredCashBreakdown] = useState(false);
	const [cashBreakdownModalVisible, setCashBreakdownModalVisible] = useState(false);
	const [cashBreakdownType, setCashBreakdownType] = useState(null);

	// Effect: Reset current transaction if refreshed and there is already transaction id
	useEffect(() => {
		if (transactionId) {
			resetTransaction();
		}
	}, []);

	// Effect: Fetch needed data
	useEffect(() => {
		validateSession(({ status, response }) => {
			if (status === request.SUCCESS) {
				if (response) {
					listCashBreakdown(session?.id);
					listBranchProducts(session?.branch_machine?.branch_id);
					listTransactions(session?.branch_machine?.id);
				} else {
					invalidSession();
				}
			}
		});
	}, []);

	// Effect: Check if there is already a start session's cash breakdown
	useEffect(() => {
		if (
			cashBreakdownStatus === request.SUCCESS &&
			cashBreakdownRecentRequest === cashBreakdownsRequestTypes.LIST_CASH_BREAKDOWNS
		) {
			if (!cashBreakdowns.find((cbd) => cbd?.type === cashBreakdownTypes.START_SESSION)) {
				setRequiredCashBreakdown(true);
				setCashBreakdownModalVisible(true);
				setCashBreakdownType(cashBreakdownTypes.START_SESSION);
			}
		}
	}, [cashBreakdowns, cashBreakdownStatus, cashBreakdownRecentRequest]);

	const isLoading = useCallback(
		() =>
			(cashBreakdownStatus === request.REQUESTING &&
				cashBreakdownRecentRequest === cashBreakdownsRequestTypes.LIST_CASH_BREAKDOWNS) ||
			[branchProductsStatus, sessionStatus, transactionsStatus].includes(request.REQUESTING),
		[
			cashBreakdownStatus,
			cashBreakdownRecentRequest,
			branchProductsStatus,
			sessionStatus,
			transactionsStatus,
		],
	);

	const getLoadingText = useCallback(
		() => (sessionStatus === request.REQUESTING ? 'Ending session...' : 'Fetching data...'),
		[sessionStatus],
	);

	const onMidSession = () => {
		setCashBreakdownModalVisible(true);
		setCashBreakdownType(cashBreakdownTypes.MID_SESSION);
	};

	const onEndSession = () => {
		setCashBreakdownModalVisible(true);
		setCashBreakdownType(cashBreakdownTypes.END_SESSION);
	};

	const onSuccessCashBreakdown = () => {
		setCashBreakdownModalVisible(false);
		setRequiredCashBreakdown(false);

		if (cashBreakdownType === cashBreakdownTypes.END_SESSION) {
			endSession();
		}
	};

	return (
		<Container loading={isLoading()} loadingText={getLoadingText()}>
			<section className="Main">
				<div className="main-content">
					<div className="left">
						<ProductSearch />
						<ProductTable />
						<NavigationButtons />
					</div>
					<div className="right">
						<Payment />
						<MainButtons onEndSession={onEndSession} onMidSession={onMidSession} />
					</div>
				</div>

				<CashBreakdownModal
					sessionId={session?.id}
					type={cashBreakdownType}
					visible={cashBreakdownModalVisible}
					required={requiredCashBreakdown}
					onClose={() => setCashBreakdownModalVisible(false)}
					onSuccess={onSuccessCashBreakdown}
				/>
			</section>
		</Container>
	);
};

export default Main;
