/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Button, Space } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Container } from '../../components';
import { SettingUrlModal } from '../../components/SettingUrl/SettingUrlModal';
import { printSalesInvoice } from '../../configurePrinter';
import { types as cashBreakdownsRequestTypes } from '../../ducks/cash-breakdowns';
import { types as sessionTypes } from '../../ducks/sessions';
import { reprintInvoiceShortcutKeys } from '../../global/options';
import { cashBreakdownTypes, request, transactionStatusTypes } from '../../global/types';
import { useCashBreakdown } from '../../hooks/useCashBreakdown';
import { useCurrentTransaction } from '../../hooks/useCurrentTransaction';
import { useSession } from '../../hooks/useSession';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useUI } from '../../hooks/useUI';
import { getKeyDownCombination } from '../../utils/function';
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
	// STATES
	const [requiredCashBreakdown, setRequiredCashBreakdown] = useState(false);
	const [cashBreakdownModalVisible, setCashBreakdownModalVisible] = useState(false);
	const [cashBreakdownType, setCashBreakdownType] = useState(null);
	const [barcodeScanLoading, setBarcodeScanLoading] = useState(false);
	const [urlModalVisible, setUrlModalVisible] = useState(false);

	// CUSTOM HOOKS
	const {
		session,
		validateSession,
		endSession,
		invalidSession,
		status: sessionStatus,
		recentRequest: sessionRecentRequest,
	} = useSession();
	const {
		transaction,
		transactionId,
		transactionStatus,
		transactionProducts,
		previousChange,
		resetTransaction,
	} = useCurrentTransaction();
	const {
		cashBreakdowns,
		listCashBreakdown,
		status: cashBreakdownStatus,
		recentRequest: cashBreakdownRecentRequest,
	} = useCashBreakdown();
	const { status: siteSettingsStatus } = useSiteSettings();
	const { isModalVisible, setModalVisible, mainLoading, mainLoadingText } = useUI();

	// METHODS
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	// Effect: Reset current transaction if refreshed and there is already transaction id
	useEffect(() => {
		if (transactionId) {
			resetTransaction();
		}

		validateSession(({ status, response }) => {
			if (status === request.SUCCESS) {
				if (response) {
					listCashBreakdown(session?.id);
				} else {
					invalidSession();
				}
			}
		});

		document.body.style.backgroundColor = 'white';
	}, []);

	useEffect(() => {
		setModalVisible(cashBreakdownModalVisible);
	}, [cashBreakdownModalVisible]);

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
			[cashBreakdownStatus, sessionStatus, siteSettingsStatus].includes(request.REQUESTING),
		[
			cashBreakdownStatus,
			cashBreakdownRecentRequest,

			siteSettingsStatus,
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

		if ([cashBreakdownStatus, siteSettingsStatus].includes(request.REQUESTING)) {
			return 'Fetching data...';
		}

		if (mainLoading) {
			return mainLoadingText;
		}
	}, [
		siteSettingsStatus,
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

	const reprintInvoice = () => {
		printSalesInvoice(transaction, transactionProducts, previousChange, true);
	};

	const handleKeyDown = (event) => {
		if (isModalVisible) {
			return;
		}

		const key = getKeyDownCombination(event);

		if (
			reprintInvoiceShortcutKeys.includes(key) &&
			transactionStatus === transactionStatusTypes.FULLY_PAID
		) {
			reprintInvoice();
		}
	};

	return (
		<Container loading={isLoading()} loadingText={getLoadingText()}>
			<BarcodeScanner setLoading={setBarcodeScanLoading} />

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
							/>
						)}

						{transactionStatus === transactionStatusTypes.FULLY_PAID && (
							<Alert
								className="full-paid-reprint"
								message="This transaction is fully paid."
								type="info"
								action={
									<Space>
										<Button size="large" type="primary" onClick={reprintInvoice}>
											REPRINT INVOICE
										</Button>
									</Space>
								}
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
				<div className="footer">
					<h2 className="set-url" onClick={() => setUrlModalVisible(true)}>
						Set Local URL
					</h2>
					<h1 className="store-title">EJ &amp; JY WET MARKET AND ENTERPRISES</h1>
				</div>

				<SettingUrlModal visible={urlModalVisible} onClose={() => setUrlModalVisible(false)} />

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
