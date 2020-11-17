import { Divider } from 'antd';
import { Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { Button, ControlledInput, FieldError, Label } from '../../../../components/elements';
import { numberWithCommas, removeCommas, sleep } from '../../../../utils/function';
import AmountTendered from './AmountTendered';
import validator from 'validator';

interface Props {
	inputRef?: any;
	amountDue: number;
	onSubmit: any;
	onClose: any;
}

export const PaymentForm = ({ inputRef, amountDue, onSubmit, onClose }: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				amountTendered: '',
			},
			Schema: Yup.object().shape({
				amountTendered: Yup.string()
					.test('valid-amount', 'Please input a valid amount.', function (value) {
						return validator.isCurrency(removeCommas(value));
					})
					.test(
						'below-amount-due',
						`Amount must be greater than or equals to ₱${numberWithCommas(amountDue)}.`,
						function (value) {
							return removeCommas(value) >= amountDue;
						},
					)
					.required()
					.label('Amount Tendered'),
			}),
		}),
		[amountDue],
	);

	return (
		<Formik
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
			{({ values, errors, touched }) => (
				<Form className="form">
					<Label
						classNames="quantity-label"
						id="amountTendered"
						label="Amount Tendered (₱)"
						spacing
					/>
					<AmountTendered inputRef={inputRef} id="amountTendered" autoFocus />
					{errors.amountTendered && touched.amountTendered ? (
						<FieldError error={errors.amountTendered} />
					) : null}

					<Label classNames="quantity-label space-top" label="Amount Due (₱)" spacing />
					<ControlledInput
						classNames="amount-due-input"
						value={numberWithCommas(amountDue)}
						onChange={() => null}
						disabled
					/>

					<Label classNames="quantity-label space-top" label="Change" spacing />
					<ControlledInput
						value={
							removeCommas(values?.amountTendered) - amountDue < 0
								? 0
								: `₱${numberWithCommas(
										(removeCommas(values?.amountTendered) - amountDue).toFixed(2),
								  )}`
						}
						onChange={() => null}
						disabled
					/>

					<Divider />

					<div className="custom-footer">
						<Button
							type="button"
							text="Cancel"
							size="lg"
							onClick={onClose}
							classNames="btn-cancel"
							disabled={isSubmitting}
						/>
						<Button
							type="submit"
							text="Submit"
							size="lg"
							variant="primary"
							loading={isSubmitting}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
