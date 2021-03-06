/* eslint-disable react-hooks/exhaustive-deps */
import { Modal } from 'antd';
import React from 'react';
import { DetailsRow, DetailsSingle } from '../../../../components';
import { KeyboardButtonDisplay } from '../../../../components/KeyboardButton/KeyboardButtonDisplay';
import {
	cashCollectionShortcutKeysDisplay,
	deleteItemShortcutKeysDisplay,
	discountItemShortcutKeysDisplay,
	editClientShortcutKeysDisplay,
	editQuantityShortcutKeysDisplay,
	endSessionShortcutKeysDisplay,
	queueResumeShortcutKeysDisplay,
	othersShortcutKeysDisplay,
	resetShortcutKeysDisplay,
	searchShortcutKeysDisplay,
	tenderShortcutKeysDisplay,
	voidShortcutKeysDisplay,
	discountAmountShortcutKeysDisplay,
	reprintInvoiceShortcutKeysDisplay,
} from '../../../../global/options';
import './style.scss';

interface Props {
	visible: boolean;
	onClose: any;
}

export const KeyboardShortcutsModal = ({ visible, onClose }: Props) => {
	return (
		<Modal
			title="Keyboard Shortcuts"
			className="KeyboardShortcutsModal"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<DetailsRow>
				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={12}
					valueSpan={12}
					label="Others"
					value={othersShortcutKeysDisplay.map((key) => (
						<KeyboardButtonDisplay key={key} keyboardKey={key} />
					))}
				/>

				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={12}
					valueSpan={12}
					label="Cash Collection"
					value={cashCollectionShortcutKeysDisplay.map((key) => (
						<KeyboardButtonDisplay key={key} keyboardKey={key} />
					))}
				/>

				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={12}
					valueSpan={12}
					label="End Session"
					value={endSessionShortcutKeysDisplay.map((key) => (
						<KeyboardButtonDisplay key={key} keyboardKey={key} />
					))}
				/>

				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={12}
					valueSpan={12}
					label="Delete Item"
					value={deleteItemShortcutKeysDisplay.map((key) => (
						<KeyboardButtonDisplay key={key} keyboardKey={key} />
					))}
				/>

				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={12}
					valueSpan={12}
					label="Discount Item"
					value={discountItemShortcutKeysDisplay.map((key) => (
						<KeyboardButtonDisplay key={key} keyboardKey={key} />
					))}
				/>

				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={12}
					valueSpan={12}
					label="Discount Amount"
					value={discountAmountShortcutKeysDisplay.map((key) => (
						<KeyboardButtonDisplay key={key} keyboardKey={key} />
					))}
				/>

				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={12}
					valueSpan={12}
					label="Edit Client"
					value={editClientShortcutKeysDisplay.map((key) => (
						<KeyboardButtonDisplay key={key} keyboardKey={key} />
					))}
				/>

				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={12}
					valueSpan={12}
					label="Edit Quantity"
					value={editQuantityShortcutKeysDisplay.map((key) => (
						<KeyboardButtonDisplay key={key} keyboardKey={key} />
					))}
				/>

				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={12}
					valueSpan={12}
					label="Advance"
					value={tenderShortcutKeysDisplay.map((key) => (
						<KeyboardButtonDisplay key={key} keyboardKey={key} />
					))}
				/>

				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={12}
					valueSpan={12}
					label="Queue"
					value={queueResumeShortcutKeysDisplay.map((key) => (
						<KeyboardButtonDisplay key={key} keyboardKey={key} />
					))}
				/>

				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={12}
					valueSpan={12}
					label="Search Bar"
					value={searchShortcutKeysDisplay.map((key) => (
						<KeyboardButtonDisplay key={key} keyboardKey={key} />
					))}
				/>

				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={12}
					valueSpan={12}
					label="Void"
					value={voidShortcutKeysDisplay.map((key) => (
						<KeyboardButtonDisplay key={key} keyboardKey={key} />
					))}
				/>

				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={12}
					valueSpan={12}
					label="Reset"
					value={resetShortcutKeysDisplay.map((key) => (
						<KeyboardButtonDisplay key={key} keyboardKey={key} />
					))}
				/>

				<DetailsSingle
					classNamesLabel="label"
					classNamesValue="value"
					labelSpan={12}
					valueSpan={12}
					label="Reprint Invoice"
					value={reprintInvoiceShortcutKeysDisplay.map((key) => (
						<KeyboardButtonDisplay key={key} keyboardKey={key} />
					))}
				/>
			</DetailsRow>
		</Modal>
	);
};
