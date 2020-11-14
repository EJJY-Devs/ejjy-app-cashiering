import { Divider } from 'antd';
import { Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, FormInput, Label } from '../../../../../components/elements';
import { sleep } from '../../../../../utils/function';

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
				amountDue,
			},
			Schema: Yup.object().shape({
				amountTendered: Yup.number().required().min(amountDue).label('Amount Tendered'),
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
					<FormInput
						inputRef={inputRef}
						type="number"
						classNames="amount-tendered-input"
						id="amountTendered"
						autoFocus
					/>
					{errors.amountTendered && touched.amountTendered ? (
						<FieldError error={errors.amountTendered} />
					) : null}

					<Label
						classNames="quantity-label space-top"
						id="amountDue"
						label="Amount Due (₱)"
						spacing
					/>
					<FormInput type="number" classNames="amount-due-input" id="amountDue" disabled />

					{Number(values?.amountTendered) - amountDue >= 0 && (
						<Label
							classNames="quantity-label space-top"
							label={
								<>
									<span>Change: </span>
									<span className="change-value">
										₱{(Number(values?.amountTendered) - amountDue).toFixed(2)}
									</span>
								</>
							}
							spacing
						/>
					)}

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
