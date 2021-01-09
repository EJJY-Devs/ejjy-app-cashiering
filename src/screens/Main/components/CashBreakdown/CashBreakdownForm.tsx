import { Col, Divider, Row } from 'antd';
import { Form, Formik } from 'formik';
import React, { useCallback, useRef, useState } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, FormInput, Label } from '../../../../components/elements';
import { sleep } from '../../../../utils/function';

interface Props {
	inputRef?: any;
	required: boolean;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const CashBreakdownForm = ({ inputRef, required, onSubmit, onClose, loading }: Props) => {
	// STATES
	const [isSubmitting, setSubmitting] = useState(false);

	// REFS
	const formRef = useRef(null);

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				coins_25: 0,
				coins_50: 0,
				coins_1: 0,
				coins_5: 0,
				coins_10: 0,
				bills_20: 0,
				bills_50: 0,
				bills_100: 0,
				bills_200: 0,
				bills_500: 0,
				bills_1000: 0,
			},
			Schema: Yup.object().shape({
				coins_25: Yup.number().required().min(0).max(65535).label('25 Coins'),
				coins_50: Yup.number().required().min(0).max(65535).label('50 Coins'),
				coins_1: Yup.number().required().min(0).max(65535).label('1 Coins'),
				coins_5: Yup.number().required().min(0).max(65535).label('5 Coins'),
				coins_10: Yup.number().required().min(0).max(65535).label('10 Coins'),
				bills_20: Yup.number().required().min(0).max(65535).label('20 Bills'),
				bills_50: Yup.number().required().min(0).max(65535).label('50 Bills'),
				bills_100: Yup.number().required().min(0).max(65535).label('100 Bills'),
				bills_200: Yup.number().required().min(0).max(65535).label('200 Bills'),
				bills_500: Yup.number().required().min(0).max(65535).label('500 Bills'),
				bills_1000: Yup.number().required().min(0).max(65535).label('1000 Bills'),
			}),
		}),
		[],
	);

	const getFieldInput = (id, label, errors, touched) => (
		<div className="breakdown-field">
			<Row gutter={[15, 0]} align="middle">
				<Col md={14} xs={12}>
					<Label classNames="breakdown-label" id={id} label={label} spacing />
				</Col>
				<Col md={10} xs={12}>
					<FormInput type="number" classNames="breakdown-input" id={id} />
				</Col>
			</Row>
			{errors?.[id] && touched?.[id] ? <FieldError error={errors?.[id]} /> : null}
		</div>
	);

	const onKeyDown = (event) => {
		if ((event.charCode || event.keyCode) === 13) {
			event.preventDefault();
			return;
		}

		if ((event.charCode || event.keyCode) === 112) {
			formRef.current?.submitForm();
		}
	};

	return (
		<Formik
			innerRef={(e) => (formRef.current = e)}
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (values, { resetForm }) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				onSubmit(values);
				resetForm();
			}}
			enableReinitialize
		>
			{({ errors, touched }) => (
				<Form className="form" onKeyDown={onKeyDown}>
					<p className="title">Coins</p>
					<div className="breakdown-field">
						<Row gutter={[15, 0]} align="middle">
							<Col md={14} xs={12}>
								<Label classNames="breakdown-label" id="coins_25" label="₱0.25" spacing />
							</Col>
							<Col md={10} xs={12}>
								<FormInput
									inputRef={inputRef}
									type="number"
									classNames="breakdown-input"
									id="coins_25"
								/>
							</Col>
						</Row>
						{errors?.coins_25 && touched?.coins_25 ? <FieldError error={errors?.coins_25} /> : null}
					</div>

					{getFieldInput('coins_50', '₱0.50', errors, touched)}
					{getFieldInput('coins_1', '₱1.00', errors, touched)}
					{getFieldInput('coins_5', '₱5.00', errors, touched)}
					{getFieldInput('coins_10', '₱10.00', errors, touched)}

					<Divider dashed />

					<p className="title">Bills</p>
					{getFieldInput('bills_20', '₱20', errors, touched)}
					{getFieldInput('bills_50', '₱50', errors, touched)}
					{getFieldInput('bills_100', '₱100', errors, touched)}
					{getFieldInput('bills_200', '₱200', errors, touched)}
					{getFieldInput('bills_500', '₱500', errors, touched)}
					{getFieldInput('bills_1000', '₱1000', errors, touched)}

					<Divider />

					<div className="custom-footer">
						{!required && (
							<Button
								type="button"
								text={
									<>
										<span>Cancel</span>
										<span className="shortcut-key">[ESC]</span>
									</>
								}
								size="lg"
								onClick={onClose}
								classNames="space-right"
								disabled={loading || isSubmitting}
								hasShortcutKey
							/>
						)}

						<Button
							type="submit"
							text={
								<>
									<span>Submit</span>
									<span className="shortcut-key">[F1]</span>
								</>
							}
							size="lg"
							variant="primary"
							loading={loading || isSubmitting}
							hasShortcutKey
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
