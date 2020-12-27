/* eslint-disable react-hooks/exhaustive-deps */
import { Alert } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Container } from '../../components';
import { types as cashBreakdownsRequestTypes } from '../../ducks/cash-breakdowns';
import { types as sessionTypes } from '../../ducks/sessions';
import { cashBreakdownTypes, request, transactionStatusTypes } from '../../global/types';
import { useBranchProducts } from '../../hooks/useBranchProducts';
import { useCashBreakdown } from '../../hooks/useCashBreakdown';
import { useCurrentTransaction } from '../../hooks/useCurrentTransaction';
import { useSession } from '../../hooks/useSession';
import { useUI } from '../../hooks/useUI';
import { BarcodeScanner } from './components/BarcodeScanner/BarcodeScanner';
import { CashBreakdownModal } from './components/CashBreakdown/CashBreakdownModal';
import { MainButtons } from './components/MainButtons/MainButtons';
import { NavigationButtons } from './components/NavigationButtons/NavigationButtons';
import { Payment } from './components/Payment/Payment';
import { ProductSearch } from './components/ProductSearch/ProductSearch';
import { ProductTable } from './components/ProductTable/ProductTable';
import './style.scss';

const voidTransactionStatus = [
	transactionStatusTypes.VOID_EDITED,
	transactionStatusTypes.VOID_CANCELLED,
];

const Main = () => {
	const {
		session,
		validateSession,
		endSession,
		invalidSession,
		status: sessionStatus,
		recentRequest: sessionRecentRequest,
	} = useSession();
	const { transactionId, transactionStatus, resetTransaction } = useCurrentTransaction();
	const {
		cashBreakdowns,
		listCashBreakdown,
		status: cashBreakdownStatus,
		recentRequest: cashBreakdownRecentRequest,
	} = useCashBreakdown();
	const { listBranchProducts, status: branchProductsStatus } = useBranchProducts();
	const { mainLoading, mainLoadingText } = useUI();

	// States
	const [requiredCashBreakdown, setRequiredCashBreakdown] = useState(false);
	const [cashBreakdownModalVisible, setCashBreakdownModalVisible] = useState(false);
	const [cashBreakdownType, setCashBreakdownType] = useState(null);
	const [barcodeScanLoading, setBarcodeScanLoading] = useState(false);

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
					listBranchProducts(session?.user?.branch?.id);
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
			mainLoading ||
			[cashBreakdownStatus, branchProductsStatus, sessionStatus].includes(request.REQUESTING),
		[
			cashBreakdownStatus,
			cashBreakdownRecentRequest,
			branchProductsStatus,
			sessionStatus,
			mainLoading,
		],
	);

	const getLoadingText = useCallback(() => {
		if (sessionStatus === request.REQUESTING) {
			if (sessionRecentRequest === sessionTypes.VALIDATE_SESSION) {
				return 'Validating session...';
			}

			if (sessionRecentRequest === sessionTypes.END_SESSION) {
				return 'Ending session...';
			}
		}

		if ([cashBreakdownStatus, branchProductsStatus].includes(request.REQUESTING)) {
			return 'Fetching data...';
		}

		if (mainLoading) {
			return mainLoadingText;
		}
	}, [
		branchProductsStatus,
		cashBreakdownStatus,
		cashBreakdownRecentRequest,

		sessionStatus,
		sessionRecentRequest,

		mainLoading,
		mainLoadingText,
	]);

	const onCashCollection = () => {
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

						{voidTransactionStatus.includes(transactionStatus) && (
							<Alert
								className="void-warning"
								message="This transaction was voided."
								type="warning"
								showIcon
								closable
							/>
						)}

						<ProductTable isLoading={barcodeScanLoading} />
						<NavigationButtons />
					</div>
					<div className="right">
						<Payment />
						<MainButtons onEndSession={onEndSession} onCashCollection={onCashCollection} />
					</div>
				</div>

				<h1 className="store-title">EJ & JY WET MARKET AND ENTERPRISES</h1>

				<BarcodeScanner setLoading={setBarcodeScanLoading} />

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
