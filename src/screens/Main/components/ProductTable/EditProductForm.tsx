import { Divider } from 'antd';
import { Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, FormInput, Label } from '../../../../components/elements';
import { sleep } from '../../../../utils/function';

interface Props {
	fieldLabel: string;
	maxQuantity: number;
	inputRef?: any;
	onSubmit: any;
	onClose: any;
}

export const EditProductForm = ({
	fieldLabel,
	maxQuantity,
	inputRef,
	onSubmit,
	onClose,
}: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				quantity: '',
			},
			Schema: Yup.object().shape({
				quantity: Yup.number().required().min(1).max(maxQuantity).label('Quantity'),
			}),
		}),
		[maxQuantity],
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
			{({ errors, touched }) => (
				<Form className="form">
					<Label classNames="quantity-label" id="quantity" label={fieldLabel} spacing />
					<FormInput
						inputRef={inputRef}
						type="number"
						classNames="quantity-input"
						id="quantity"
						autoFocus
					/>
					{errors.quantity && touched.quantity ? <FieldError error={errors.quantity} /> : null}

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
